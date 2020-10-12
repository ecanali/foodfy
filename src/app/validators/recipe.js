const User = require('../models/User')

const Recipe = require('../models/Recipe')
const { compare } = require('bcryptjs')

async function checkAllFields(req) {
    // check if it has all fields
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "") {            
            // const chefOptions = await Recipe.chefsSelectOptions()

            return {
                // chefOptions,
                recipe: req.body,
                error: "Por favor, preencha todos os campos.",
                userSession: req.user
            }
        }
    }
}

async function post(req, res, next) {    
    // check if it has all fields
    console.log(req)
    
    const fillAllFields = checkAllFields(req)

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
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/profile', fillAllFields)
    }

    const { id, password } = req.body

    if (!password) return res.render('admin/profile/index', {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro."
    })

    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("admin/profile/index", {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user

    next()
}

module.exports = {
    post,
    update
}