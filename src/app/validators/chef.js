const User = require('../models/User')

const Recipe = require('../models/Recipe')
const { compare } = require('bcryptjs')

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

async function post(req, res, next) {    
    // check if it has all fields
    const fillAllFields = checkAllFields(req)

    if (fillAllFields)
        return res.render('admin/chefs/create', fillAllFields)

    if (req.files.length == 0)
        return res.render('admin/chefs/create', {
            error: "Por favor envie uma imagem!",
            chef: req.body,
            userSession: req.user
        })

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