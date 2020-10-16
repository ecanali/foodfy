const Recipe = require('../models/Recipe')

const { getRecipeImages } = require('../../lib/utils')

async function checkAllFields(req) {
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
}

async function checkAllFieldsAndFiles(req) {
    // check if it has all fields
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
}

async function post(req, res, next) {    
    // check if it has all fields
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
}

async function update(req, res, next) {
    // check if it has all fields
        const fillAllFieldsAndFiles = await checkAllFieldsAndFiles(req)

    if (fillAllFieldsAndFiles)
        return res.render('admin/recipes/edit', fillAllFieldsAndFiles)

    next()
}

module.exports = {
    post,
    update
}