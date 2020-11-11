const Recipe = require('../models/Recipe')

const { getRecipeImages } = require('../../lib/utils')

async function checkAllFields(req) {
    try {
        // check if it has all fields
        const keys = Object.keys(req.body)
    
        for (let key of keys) {
            if (req.body[key] == "") {
                const chefOptions = await Recipe.chefsSelectOptions()
    
                return {
                    chefOptions,
                    recipe: req.body,
                    error: "Por favor, preencha todos os campos.",
                    userSession: req.user
                }
            }
        }
        
    } catch (error) {
        console.error(error)
    }
}

async function checkAllFieldsAndFiles(req) {
    try {
        // check if it has all fields and files
        const keys = Object.keys(req.body)
    
        for (let key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                const chefOptions = await Recipe.chefsSelectOptions()
                const recipe = req.body
                recipe.img = await getRecipeImages(recipe.id, req)
    
                return {
                    chefOptions,
                    recipe,
                    files: recipe.img,
                    error: "Por favor, preencha todos os campos.",
                    userSession: req.user
                }
            }
        }
        
    } catch (error) {
        console.error(error)
    }
}

async function post(req, res, next) {    
    try {
        const fillAllFields = await checkAllFields(req)
    
        if (fillAllFields)
            return res.render('admin/recipes/create', fillAllFields)
    
        if (req.files.length == 0) {
            const chefOptions = await Recipe.chefsSelectOptions()
            
            return res.render('admin/recipes/create', {
                chefOptions,
                recipe: req.body,
                error: "Por favor, envie pelo menos 1 imagem.",
                userSession: req.user
            })
        }
    
        next()
        
    } catch (error) {
        console.error(error)
    }
}

async function update(req, res, next) {
    try {
        const fillAllFieldsAndFiles = await checkAllFieldsAndFiles(req)
    
        if (fillAllFieldsAndFiles)
            return res.render('admin/recipes/edit', fillAllFieldsAndFiles)
    
        next()
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    post,
    update
}