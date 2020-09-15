const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render('admin/session/login', {
        user: req.body,
        error: "Usuário não cadastrado!"
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("admin/session/login", {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })
    
        if (!user) return res.render('admin/session/forgot-password', {
            user: req.body,
            error: "Email não cadastrado!"
        })
        
        req.user = user

        next()

    } catch (error) {
        console.error(error)
    }
}

async function reset(req, res, next) {
    // search user
    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render('admin/session/password-reset', {
        user: req.body,
        token,
        error: "Usuário não cadastrado!"
    })

    // check if password matches
    if (password != passwordRepeat) return res.render('admin/session/password-reset', {
        user: req.body,
        token,
        error: "A senha e a repetição da senha estão incorretas."
    })

    // check if token matches
    if (token != user.reset_token) return res.render('admin/session/password-reset', {
        user: req.body,
        token,
        error: "Token inválido! Solicite uma nova recuperação de senha."
    })

    // check if token not expired
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('admin/session/password-reset', {
        user: req.body,
        token,
        error: "Token expirado! Solicite uma nova recuperação de senha."
    })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}