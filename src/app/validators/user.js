const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    // check if it has all fields
    const keys = Object.keys(body)

    for (let key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: "Por favor, preencha todos os campos.",
                userSession
            }
        }
    }
}

async function isAdmin(req, res, next) {
    // const { userId: id } = req.session

    // const user = await User.findOne({ where: {id} })

    const user = req.user

    if (!user || user.is_admin == false) return res.render('admin/session/login', {
        error: "Usuário não encontrado/permitido."
    })

    req.user = user

    next()
}

async function post(req, res, next) {
    const { user: userSession } = req
    
    // check if it has all fields
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/users/create', fillAllFields)
    }

    // check if user exists [email unique]
    let { email} = req.body

    const user = await User.findOne({
        where: { email }
    })

    if (user) return res.render('admin/users/create', {
        user: req.body,
        error: "Usuário já cadastrado.",
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
    update,
    isAdmin
}