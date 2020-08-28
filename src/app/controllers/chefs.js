const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {

    async index(req, res) {
        try {
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
    
            return res.render('admin/chefs/index', { chefs: lastAdded })
            
        } catch (error) {
            console.error(error)
        }
    },

    create(req, res) {
        return res.render('admin/chefs/create')
    },

    async post(req, res) {
        // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill out all fields")
        }

        if (req.files.length == 0)
            return res.send('Please send at least one image')

        const filesPromise = req.files.map(file => File.create(file))
        const filesResults = await Promise.all(filesPromise)

        const chefFilesPromise = filesResults.map(async file => {
            const fileId = file.rows[0].id

            await Chef.create(req.body, fileId)
        })

        await Promise.all(chefFilesPromise)

        return res.redirect(`/admin/chefs`)
    },

    async show(req, res) {
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

        return res.render('admin/chefs/chef', { recipes: recipeImages, chef, files })
    },

    async edit(req, res) {        
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send('Chef not found!')

        // get images
        results = await Chef.files(chef.file_id)
        const files = results.rows.map(chef => ({
        ...chef,
        src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }))

        return res.render('admin/chefs/edit', { chef, files })
    },

    async put(req, res) {
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

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },

    async delete(req, res) {        
        if (req.body.totalRecipes > 0) {
            return res.send("Deletion denied, you must delete his/her recipes first!")
        }
        
        await Chef.delete(req.body.id, req.body.file_id)
        
        return res.redirect('/admin/chefs')
    }

}
