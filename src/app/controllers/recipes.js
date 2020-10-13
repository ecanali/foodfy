const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { getRecipeImages } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            const userSession = req.user

            let recipes
            
            // normal/admin user logic
            if (userSession.is_admin == true) {
                recipes = await Recipe.all()
            } else {
                recipes = await Recipe.userRecipes(userSession.id)
            }

            const recipesPromise = recipes.map(async recipe => {
                const recipeImages = await getRecipeImages(recipe.id, req)
                recipe.img = recipeImages[0]
                
                return recipe
            })
    
            const lastAdded = await Promise.all(recipesPromise)
            
            return res.render('admin/recipes/index', { 
                recipes: lastAdded, 
                userSession 
            })
            
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        const userSession = req.user

        const chefOptions = await Recipe.chefsSelectOptions()

        return res.render('admin/recipes/create', { chefOptions, userSession })
    },
    async post(req, res) {
        try {
            const userSession = req.user
    
            const recipeId = await Recipe.create(req.body, userSession.id)
    
            const filesPromise = req.files.map(file => File.create(file))
            const filesResults = await Promise.all(filesPromise)
    
            const recipeFilesPromise = filesResults.map(file => {
                const fileId = file[0].id
    
                File.relateFileDB(fileId, recipeId)
            })
    
            await Promise.all(recipeFilesPromise)

            // index render requirements
            let recipes
            
            // normal/admin user logic
            if (userSession.is_admin == true) {
                recipes = await Recipe.all()
            } else {
                recipes = await Recipe.userRecipes(userSession.id)
            }

            const recipesPromise = recipes.map(async recipe => {
                recipeImages = await getRecipeImages(recipe.id, req)
                recipe.img = recipeImages[0]
                
                return recipe
            })
    
            const lastAdded = await Promise.all(recipesPromise)
            
            return res.render('admin/recipes/index', { 
                recipes: lastAdded, 
                userSession,
                success: "Receita cadastrada com sucesso!"
            })

        } catch (error) {
            console.error(error)

            const chefOptions = await Recipe.chefsSelectOptions()

            return res.render('admin/recipes/create', { 
                chefOptions,
                recipe: req.body, 
                userSession: req.user, 
                error: "Algum erro aconteceu!"
            })
        }
    },
    async show(req, res) {
        try {            
            const recipe = await Recipe.find(req.params.id)

            recipe.img = await getRecipeImages(recipe.id, req)
    
            return res.render('admin/recipes/recipe', { 
                recipe, 
                files: recipe.img, 
                userSession: req.user
            })
            
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {
        try {
            const userSession = req.user

            const recipe = await Recipe.find(req.params.id)

            recipe.img = await getRecipeImages(recipe.id, req)
    
            const chefOptions = await Recipe.chefsSelectOptions()

            if (userSession.id != recipe.user_id && userSession.is_admin != true) {
                return res.render('admin/session/login', {
                    error: "Usuário não encontrado/permitido."
                })
            }

            return res.render('admin/recipes/edit', { 
                recipe, 
                chefOptions, 
                files: recipe.img, 
                userSession 
            })
            
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {    
            const recipeId = req.body.id
            const filesPromise = req.files.map(file => File.create(file))
            const filesResults = await Promise.all(filesPromise)

            const recipeFilesPromise = filesResults.map(file => {
                const fileId = file.rows[0].id

                File.relateFileDB(fileId, recipeId)
            })

            await Promise.all(recipeFilesPromise)
    
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",") // [1,2,3,]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1) // [1,2,3]
    
                const removedFilesPromise = removedFiles.map(id => File.removeDeletedFileFromPUT(id))
    
                await Promise.all(removedFilesPromise)
            }
    
            await Recipe.update(req.body)
            
            // show render requirements
            const recipe = await Recipe.find(req.body.id)

            recipe.img = await getRecipeImages(recipe.id, req)
    
            return res.render('admin/recipes/recipe', { 
                recipe, 
                files: recipe.img, 
                success: "Receita atualizada com sucesso!",
                userSession: req.user
            })

        } catch (error) {
            console.error(error)

            const recipe = await Recipe.find(req.body.id)
            recipe.img = await getRecipeImages(recipe.id, req)
            const chefOptions = await Recipe.chefsSelectOptions()

            return res.render('admin/recipes/edit', { 
                recipe, 
                chefOptions, 
                files: recipe.img, 
                userSession: req.user,
                error: "Algum erro aconteceu!",
            })
        }
    },

    async delete(req, res) {
        try {
            const userSession = req.user
            
            await Recipe.delete(req.body.id)

            // index render requirements
            let results, recipes
            
            if (userSession.is_admin == true) {
                results = await Recipe.all()
                recipes = results.rows
            } else {
                results = await Recipe.userRecipes(userSession.id)
                recipes = results.rows
            }

            if (!recipes) res.send('Recipes not found')

            const recipesPromise = recipes.map(async recipe => {
                recipeImages = await getRecipeImages(recipe.id, req)
                recipe.img = recipeImages[0]

                return recipe
            })
    
            const lastAdded = await Promise.all(recipesPromise)
            
            return res.render('admin/recipes/index', { 
                recipes: lastAdded, 
                userSession,
                success: "Receita deletada com sucesso!",
            })
                        
        } catch (error) {
            console.error(error)

            // edit render requirements
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
            
            if (!recipe) return res.send('Recipe not found!')
    
            // get images
            results = await Recipe.files(recipe.id)
            const files = results.rows.map(recipe => ({
            ...recipe,
            src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
            }))
    
            results = await Recipe.chefsSelectOptions()
            const options = results.rows

            return res.render('admin/recipes/edit', { 
                recipe, 
                chefOptions: options, 
                files, 
                userSession,
                error: "Algum erro aconteceu!",
            })
        }
    }

}
