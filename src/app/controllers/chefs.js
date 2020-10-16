const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

async function getChefImage(chefId, req) {
    const results = await Chef.filesByChefId(chefId)
    const files = results.map(chef => ({
        ...chef,
        src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }))
        
    return files[0]
}

async function getRecipeImage(recipeId, req) {
    const results = await Recipe.files(recipeId)
    const files = results.map(recipe => ({
        ...recipe,
        src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
        }))
        
    return files[0]
}

module.exports = {
    async index(req, res) {
        try {
            const chefs = await Chef.all()

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getChefImage(chef.id, req)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                userSession: req.user 
            })
            
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
            const filesPromise = req.files.map(file => File.create(file))

            const filesResults = await Promise.all(filesPromise)

            const chefFilesPromise = filesResults.map(async file => {
                const file_id = file[0].id
    
                await Chef.create({ 
                    name: req.body.name,
                    file_id
                })
            })
    
            await Promise.all(chefFilesPromise)
    
            // index render requirements
            const chefs = await Chef.all()

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getChefImage(chef.id, req)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                userSession: req.user 
            })
            
        } catch (error) {
            console.error(error)

            return res.render('admin/chefs/create', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                userSession: req.user
            })
        }
    },
    async show(req, res) {
        try {
            const userSession = req.user
        
            const chef = await Chef.find(req.params.id)

            const chefImage = await getChefImage(req.params.id, req)

            const recipes = await Chef.chefRecipesList(req.params.id)
    
            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getRecipeImage(recipe.id, req)
    
                return recipe
            })
    
            const recipeImages = await Promise.all(recipesPromise)

            return res.render('admin/chefs/chef', { recipes: recipeImages, chef, chefImage, userSession })
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {   
        try {
            const userSession = req.user

            const chef = await Chef.find(req.params.id)
    
            const chefImage = await getChefImage(req.params.id, req)
    
            return res.render('admin/chefs/edit', { chef, chefImage, userSession })

        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const oldFileId = req.body.file_id
            const filesPromise = req.files.map(file => File.create(file))
            const filesResults = await Promise.all(filesPromise)

            const chefFilesPromise = filesResults.map(async file => {
                const file_id = file[0].id

                await Chef.update(req.body.id, {
                    name: req.body.name,
                    file_id
                })

                File.removeDeletedAvatarDB(oldFileId)
            })

            await Promise.all(chefFilesPromise)
            
            // show render requirements
            const chef = await Chef.find(req.body.id)

            const chefImage = await getChefImage(req.body.id, req)

            const recipes = await Chef.chefRecipesList(req.body.id)
    
            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getRecipeImage(recipe.id, req)
    
                return recipe
            })
    
            const recipeImages = await Promise.all(recipesPromise)

            return res.render('admin/chefs/chef', { 
                recipes: recipeImages, 
                chef, 
                chefImage, 
                userSession: req.user,
                success: "Chef atualizado com sucesso!"
            })
            
        } catch (error) {
            console.error(error)

            const chefImage = await getChefImage(req.params.id, req)

            return res.render('admin/chefs/edit', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                chefImage,
                userSession: req.user
            })
        }
    },
    async delete(req, res) {        
        try {           
            await Chef.delete(req.body.id)

            await File.removeDeletedAvatarDB(req.body.file_id)

            // index render requirements
            const chefs = await Chef.all()

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getChefImage(chef.id, req)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                success: "Chef deletado com sucesso!",
                userSession: req.user
            })
            
        } catch (error) {
            console.error(error)

            const chefImage = await getChefImage(req.body.id, req)

            return res.render('admin/chefs/edit', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                chefImage,
                userSession: req.user
            })
        }
    }
}