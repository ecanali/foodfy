const Chef = require('../models/Chef')

function checkAllFields(req) {
    // check if it has all fields
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "") {            
            return {
                userSession: req.user,
                error: "Por favor, preencha todos os campos.",
                chef: req.body
            }
        }
    }
}

function post(req, res, next) {    
    const fillAllFields = checkAllFields(req)

    if (fillAllFields)
        return res.render('admin/chefs/create', fillAllFields)

    if (req.files.length == 0)
        return res.render('admin/chefs/create', {
            error: "Por favor, envie uma imagem!",
            chef: req.body,
            userSession: req.user
        })

    next()
}

function update(req, res, next) {
    const fillAllFields = checkAllFields(req)

    if (fillAllFields) {
        return res.render('admin/chefs/edit', fillAllFields)
    }

    next()
}

async function hasRecipes(req, res, next) {
    try {
        // does not allow chef deletion if a recipe in his/her name
        if (req.body.totalRecipes > 0) {
            const chef = await Chef.find(req.body.id)
            const chefImage = { src: req.body.image_src }
            
            return res.render('admin/chefs/edit', {
                error: "Erro ao deletar, chef não pode ter receitas em seu nome!",
                chef,
                chefImage,
                userSession: req.user
            })
        }
    
        next()
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    post,
    update,
    hasRecipes
}