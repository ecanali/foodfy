const { compare } = require('bcryptjs')

const User = require('../models/User')

function checkAllFields(req) {
    // check if it has all fields
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "") {
            return {
                user: req.body,
                error: "Por favor, preencha todos os campos.",
                userSession: req.user
            }
        }
    }
}

function isAdmin(req, res, next) {
    const user = req.user

    if (!user || user.is_admin == false) return res.render('admin/session/login', {
        error: "Usuário não encontrado/permitido."
    })

    next()
}

async function post(req, res, next) {
    try {        
        const fillAllFields = checkAllFields(req)
    
        if (fillAllFields) {
            return res.render('admin/users/create', fillAllFields)
        }
    
        // checks if user exists [email unique]
        let { email } = req.body
    
        const user = await User.findOne({
            where: { email }
        })
    
        if (user) return res.render('admin/users/create', {
            user: req.body,
            error: "Usuário já cadastrado.",
            userSession: req.user
        })
    
        next()
        
    } catch (error) {
        console.error(error)
    }
}

async function update(req, res, next) {
    try {
        const user = req.user
        
        const fillAllFields = checkAllFields(req)
    
        if (fillAllFields) {
            return res.render('admin/profile', fillAllFields)
        }
    
        const { password } = req.body
    
        if (!password) return res.render('admin/profile/index', {
            userSession: user,
            user: req.body,
            error: "Coloque sua senha para atualizar seu cadastro."
        })
    
        const passed = await compare(password, user.password)
    
        if (!passed) return res.render("admin/profile/index", {
            userSession: user,
            user: req.body,
            error: "Senha incorreta."
        })
    
        next()
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    post,
    update,
    isAdmin
}