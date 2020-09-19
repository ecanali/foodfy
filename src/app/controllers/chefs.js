const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {

    async index(req, res) {
        try {
            const userSession = req.user

            let results = await Chef.all()
            const chefs = results.rows
    
            if (!chefs) res.send('Chefs not found')

            async function getImage(chefId) {
                let results = await Chef.filesByChefId(chefId)
                const files = results.rows.map(chef => ({
                    ...chef,
                    src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
                    }))
                    
                return files[0]
            }

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            if (userSession.is_admin == true)
                return res.render('admin/chefs/index', { chefs: lastAdded, userSession })

            return res.render('admin/chefs/index', { chefs: lastAdded })
            
        } catch (error) {
            console.error(error)
        }
    },

    create(req, res) {
        const userSession = req.user

        return res.render('admin/chefs/create', { userSession })
    },

    async post(req, res) {
        try {
            const userSession = req.user
    
            // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
            const keys = Object.keys(req.body)
    
            for (let key of keys) {
                if (req.body[key] == "")
                    return res.send("Please, fill out all fields")
            }
    
            if (req.files.length == 0)
                return res.render('admin/chefs/create', {
                    error: "Por favor envie uma imagem!",
                    chef: req.body,
                    userSession
                })
    
            const filesPromise = req.files.map(file => File.create(file))
            const filesResults = await Promise.all(filesPromise)
    
            const chefFilesPromise = filesResults.map(async file => {
                const fileId = file.rows[0].id
    
                await Chef.create(req.body, fileId)
            })
    
            await Promise.all(chefFilesPromise)
    
            // index render requirements
            let results = await Chef.all()
            const chefs = results.rows
    
            if (!chefs) res.send('Chefs not found')
    
            async function getImage(chefId) {
                let results = await Chef.filesByChefId(chefId)
                const files = results.rows.map(chef => ({
                    ...chef,
                    src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
                    }))
                    
                return files[0]
            }
    
            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)
    
                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                success: "Chef cadastrado com sucesso!",
                userSession
            })
            
        } catch (error) {
            console.error(error)

            return res.render('admin/chefs/create', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                userSession
            })
        }
    },

    async show(req, res) {
        const userSession = req.user
    
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chef not found')

        // get images
        results = await Chef.files(chef.file_id)
        const files = results.rows.map(chef => ({
        ...chef,
        src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }))

        results = await Chef.chefRecipesList(req.params.id)
        const recipes = results.rows
       
        // Pegar imagens das receitas de cada chef
        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)
            const files = results.rows.map(recipe => ({
                ...recipe,
                src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                }))
                
            return files[0]
        }

        const recipesPromise = recipes.map(async recipe => {
            recipe.img = await getImage(recipe.id)

            return recipe
        })

        const recipeImages = await Promise.all(recipesPromise)

        if (userSession.is_admin == true)
            return res.render('admin/chefs/chef', { recipes: recipeImages, chef, files, userSession })

        return res.render('admin/chefs/chef', { recipes: recipeImages, chef, files })
    },

    async edit(req, res) {   
        const userSession = req.user
        
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chef not found!')

        // get images
        results = await Chef.files(chef.file_id)
        const files = results.rows.map(chef => ({
        ...chef,
        src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }))

        return res.render('admin/chefs/edit', { chef, files, userSession })
    },

    async put(req, res) {
        try {
            const userSession = req.user
            
            // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
            const keys = Object.keys(req.body)
    
            for (let key of keys) {
                if (req.body[key] == "" && req.files.length == 0)
                    return res.send("Please, fill out all fields!")
            }
    
            if (req.files.length != 0) {
                const oldFileId = req.body.file_id
                const filesPromise = req.files.map(file => File.create(file))
                const filesResults = await Promise.all(filesPromise)
    
                const chefFilesPromise = filesResults.map(async file => {
                    const newFileId = file.rows[0].id
    
                    await Chef.update(req.body, newFileId)
    
                    File.removeDeletedAvatarDB(oldFileId)
                })
    
                await Promise.all(chefFilesPromise)
            }

            // show render requirements
            let results = await Chef.find(req.body.id)
            const chef = results.rows[0]

            if (!chef) return res.send('Chef not found')

            // get images
            results = await Chef.files(chef.file_id)
            const files = results.rows.map(chef => ({
            ...chef,
            src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
            }))

            results = await Chef.chefRecipesList(req.params.id)
            const recipes = results.rows
        
            // Pegar imagens das receitas de cada chef
            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(recipe => ({
                    ...recipe,
                    src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                    }))
                    
                return files[0]
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)

                return recipe
            })

            const recipeImages = await Promise.all(recipesPromise)
    
            return res.render(`admin/chefs/chef`, { 
                recipes: recipeImages, 
                chef, 
                files, 
                success: "Chef atualizado com sucesso!",
                userSession 
            })
            
        } catch (error) {
            console.error(error)

            return res.render('admin/chefs/edit', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                files,
                userSession
            })
        }
    },

    async delete(req, res) {        
        try {
            const userSession = req.user

            // edit render requirements
            let results = await Chef.find(req.body.id)
            const chef = results.rows[0]

            if (!chef) return res.send('Chef not found!')

            // get images
            results = await Chef.files(chef.file_id)
            const files = results.rows.map(chef => ({
            ...chef,
            src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
            }))

            // does not allow chef deletion if a recipe in his/her name
            if (req.body.totalRecipes > 0) {
                return res.render('admin/chefs/edit', {
                    error: "Erro ao deletar, chef não pode ter receitas em seu nome!",
                    chef: req.body,
                    files,
                    userSession
                })
            }

            await Chef.delete(req.body.id, req.body.file_id)
            
            // index render requirements
            results = await Chef.all()
            const chefs = results.rows
    
            if (!chefs) res.send('Chefs not found')
    
            async function getImage(chefId) {
                let results = await Chef.filesByChefId(chefId)
                const files = results.rows.map(chef => ({
                    ...chef,
                    src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
                    }))
                    
                return files[0]
            }
    
            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)
    
                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                success: "Chef deletado com sucesso!",
                userSession
            })
            
        } catch (error) {
            console.error(error)

            return res.render('admin/chefs/edit', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                files,
                userSession
            })
        }
    }

}
