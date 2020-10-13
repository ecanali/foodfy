const Recipe = require('../models/Recipe')

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
        if (req.body[key] == "" && key != "removed_files" && req.files.length == 0) {
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

    if (req.files.length == 0) {
        const chefOptions = await Recipe.chefsSelectOptions()

        return res.render('admin/recipes/edit', { 
            chefOptions, 
            userSession: req.user,
            recipe: req.body,
            error: "Por favor, envie no mínimo uma imagem!"
        })
    }

    next()
}

module.exports = {
    post,
    update
}