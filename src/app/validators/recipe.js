const User = require('../models/User')

const Recipe = require('../models/Recipe')
const { compare } = require('bcryptjs')

async function checkAllFields(body) {
    // check if it has all fields
    const keys = Object.keys(body)

    for (let key of keys) {
        if (body[key] == "") {
            const userSession = req.user
            
            let results = await Recipe.chefsSelectOptions()
            const options = results.rows

            return {
                chefOptions: options,
                recipe: body,
                error: "Por favor, preencha todos os campos.",
                userSession
            }
        }
    }
}

async function post(req, res, next) {
    const userSession = req.user
    
    // check if it has all fields
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/recipes/create', fillAllFields)
    }

    if (req.files.length == 0) return res.render('admin/recipes/create', {
        recipe: req.body,
        error: "Por favor, envie pelo menos 1 imagem.",
        userSession
    })

    req.user = userSession

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