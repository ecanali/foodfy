const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { getRecipeImages } = require('../../lib/utils')

module.exports = {

    async index(req, res) {
        try {
            const userSession = req.user

            let results, recipes
            
            // normal/admin user logic
            if (userSession.is_admin == true) {
                results = await Recipe.all()
                recipes = results.rows
            } else {
                results = await Recipe.userRecipes(userSession.id)
                recipes = results.rows
            }

            if (!recipes) res.send('Recipes not found')

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getRecipeImages(recipe.id, req)

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

        let results = await Recipe.chefsSelectOptions()
        const options = results.rows

        return res.render('admin/recipes/create', { chefOptions: options, userSession })
    },

    async post(req, res) {
        try {
            const userSession = req.user
            
            let results = await Recipe.chefsSelectOptions()
            const options = results.rows

            // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
            const keys = Object.keys(req.body)
    
            for (let key of keys) {
                if (req.body[key] == "") {
                    return res.render('admin/recipes/create', { 
                        chefOptions: options, 
                        userSession,
                        recipe: req.body,
                        error: "Por favor, preencha todos os campos!"
                    })
                }
            }

            if (req.files.length == 0) {
                return res.render('admin/recipes/create', { 
                    chefOptions: options, 
                    userSession,
                    recipe: req.body,
                    error: "Por favor, envie no mínimo uma imagem!"
                })
            }
    
            results = await Recipe.create(req.body, userSession.id)
            const recipeId = results.rows[0].id
    
            const filesPromise = req.files.map(file => File.create(file))
            const filesResults = await Promise.all(filesPromise)
    
            const recipeFilesPromise = filesResults.map(file => {
                const fileId = file.rows[0].id
    
                File.relateFileDB(fileId, recipeId)
            })
    
            await Promise.all(recipeFilesPromise)

            // index render requirements
            let recipes
            
            if (userSession.is_admin == true) {
                results = await Recipe.all()
                recipes = results.rows
            } else {
                results = await Recipe.userRecipes(userSession.id)
                recipes = results.rows
            }

            if (!recipes) res.send('Recipes not found')

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getRecipeImages(recipe.id, req)

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

            let results = await Recipe.chefsSelectOptions()
            const options = results.rows

            return res.render('admin/recipes/create', { 
                chefOptions: options,
                recipe: req.body, 
                userSession, 
                error: "Algum erro aconteceu!"
            })
        }
        
    },

    async show(req, res) {
        try {
            const userSession = req.user
            
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if (!recipe) return res.send('Recipe not found')
    
            // get images
            results = await Recipe.files(recipe.id)
            const files = results.rows.map(recipe => ({
            ...recipe,
            src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
            }))
    
            return res.render('admin/recipes/recipe', { 
                recipe, 
                files, 
                userSession
            })
            
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {
        try {
            const userSession = req.user

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

            if (userSession.id != recipe.user_id && userSession.is_admin != true) {
                return res.render('admin/session/login', {
                    error: "Usuário não encontrado/permitido."
                })
            }

            return res.render('admin/recipes/edit', { 
                recipe, 
                chefOptions: options, 
                files, 
                userSession 
            })
            
        } catch (error) {
            console.error(error)
        }
    },

    async put(req, res) {
        try {
            const userSession = req.user
            
            let results = await Recipe.chefsSelectOptions()
            const options = results.rows

            // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
            const keys = Object.keys(req.body)
    
            for (let key of keys) {
                if (req.body[key] == "" && key != "removed_files" && req.files.length == 0) {
                    return res.render('admin/recipes/edit', { 
                        chefOptions: options, 
                        userSession,
                        recipe: req.body,
                        error: "Por favor, preencha todos os campos!"
                    })
                }
            }

            if (req.files.length == 0) {
                return res.render('admin/recipes/edit', { 
                    chefOptions: options, 
                    userSession,
                    recipe: req.body,
                    error: "Por favor, envie no mínimo uma imagem!"
                })
            }
    
            if (req.files.length != 0) {
                const recipeId = req.body.id
                const filesPromise = req.files.map(file => File.create(file))
                const filesResults = await Promise.all(filesPromise)
    
                const recipeFilesPromise = filesResults.map(file => {
                    const fileId = file.rows[0].id
    
                    File.relateFileDB(fileId, recipeId)
                })
    
                await Promise.all(recipeFilesPromise)
            }
    
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",") // [1,2,3,]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1) // [1,2,3]
    
                const removedFilesPromise = removedFiles.map(id => File.removeDeletedFileFromPUT(id))
    
                await Promise.all(removedFilesPromise)
            }
    
            await Recipe.update(req.body)
            
            // show render requirements
            results = await Recipe.find(req.body.id)
            const recipe = results.rows[0]
    
            if (!recipe) return res.send('Recipe not found')
    
            // get images
            results = await Recipe.files(recipe.id)
            const files = results.rows.map(recipe => ({
            ...recipe,
            src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
            }))
    
            return res.render('admin/recipes/recipe', { 
                recipe, 
                files, 
                success: "Receita atualizada com sucesso!",
                userSession
            })

        } catch (error) {
            console.error(error)

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
                recipe.img = await getRecipeImages(recipe.id, req)

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