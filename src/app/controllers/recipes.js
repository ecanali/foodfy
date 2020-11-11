const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const File = require('../models/File')

const { getRecipeImages } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            const userSession = req.user

            // normal/admin user logic
            let recipes

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
        try {
            const chefOptions = await Recipe.chefsSelectOptions()
    
            return res.render('admin/recipes/create', { 
                chefOptions, 
                userSession: req.user 
            })
            
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const userSession = req.user
    
            const recipeId = await Recipe.create({
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information,
                user_id: userSession.id
            })

            const filesPromise = req.files.map(file => 
                File.create({ 
                    name: file.filename,
                    path: file.path
                })
            )

            const filesResults = await Promise.all(filesPromise)

            const recipeFilesPromise = filesResults.map(fileId =>
                File.relateFileDB(fileId, recipeId)
            )
    
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
                recipePostPutSuccess: "Receita cadastrada com sucesso!"
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
            if (req.files.length != 0) {
                const filesPromise = req.files.map(file => 
                    File.create({ 
                        name: file.filename,
                        path: file.path
                    })
                )

                const filesResults = await Promise.all(filesPromise)

                const recipeFilesPromise = filesResults.map(fileId =>
                    File.relateFileDB(fileId, req.body.id)
                )

                await Promise.all(recipeFilesPromise)
            }
    
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",") // [1,2,3,]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1) // [1,2,3]
    
                const removedFilesPromise = removedFiles.map(async fileId => {
                    const oldFile = await File.find(fileId)
                    
                    if (!oldFile.path.includes("recipe-placeholder"))
                        unlinkSync(oldFile.path)
                        
                    File.removeFromRecipeFilesDB(fileId)

                    File.delete(fileId)
                })
    
                await Promise.all(removedFilesPromise)
            }
    
            await Recipe.update(req.body.id, {
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information
            })
            
            // show render requirements
            const recipe = await Recipe.find(req.body.id)

            recipe.img = await getRecipeImages(recipe.id, req)
    
            return res.render('admin/recipes/recipe', { 
                recipe, 
                files: recipe.img, 
                recipePostPutSuccess: "Receita atualizada com sucesso!",
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
            const recipeFiles = await Recipe.files(req.body.id)

            const removedFilesPromise = recipeFiles.map(async file => {
                await File.removeFromRecipeFilesDB(file.id)
                
                File.delete(file.id)

                if (!file.path.includes("recipe-placeholder"))
                    unlinkSync(file.path)
            })

            await Promise.all(removedFilesPromise)

            await Recipe.delete(req.body.id)

            const userSession = req.user

            // index render requirements
            // normal/admin user logic
            let recipes

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
                userSession,
                recipeDeleteSuccess: "Receita deletada com sucesso!",
            })
                        
        } catch (error) {
            console.error(error)

            // edit render requirements
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
    }
}