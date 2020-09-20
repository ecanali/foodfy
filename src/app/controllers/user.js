const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const user = require('../validators/user')

module.exports = {
    async list(req, res) {
        try {
            const userSession = req.user
            let results = await User.all()
            const users = results.rows
    
            if (!users) res.send('Users not found')
            
            return res.render('admin/users/list', { users, userSession })
            
        } catch (error) {
            console.error(error)
        }
    },

    create(req, res) {
        const userSession = req.user

        return res.render('admin/users/create', { userSession })
    },

    async edit(req, res) {    
        const userSession = req.user
        let results = await User.find(req.params.id)
        const user = results.rows[0]

        if (!user) return res.send('User not found!')

        return res.render('admin/users/edit', { user, userSession })
    },

    async post(req, res) {
        const userSession = req.user
        const { email } = req.body

        // create 
        const passwordToken = crypto.randomBytes(4).toString("hex")

        // send email (by "nodemailer") with auto generated password-token
        await mailer.sendMail({
            to: email,
            from: 'no-reply@foodfy.com.br',
            subject: "Sua senha | Foodfy",
            html: `<h2>Segue abaixo sua senha automática, por favor altere assim que possível.</h2>
                <p>${passwordToken}</p>
            `
        })

        await User.create(req.body, passwordToken)
        
        let results = await User.all()
        const users = results.rows
    
        if (!users) res.send('Users not found')

        return res.render('admin/users/list', {
            users,
            userSession,
            success: "Usuário cadastrado com sucesso! Senha enviada para o e-mail informado."
        })
    },

    async put(req, res) {
        try {
            const userSession = req.user
            let { name, email, isAdmin, id } = req.body
    
            await User.update(id, {
                name,
                email,
                is_admin: isAdmin || 0
            })

            let results = await User.find(id)
            const user = results.rows[0]
    
            if (!user) return res.send('User not found!')

            return res.render('admin/users/edit', {
                userSession,
                user,
                success: "Conta atualizada com sucesso!",
            })

        } catch (error) {
            console.error(error)

            return res.render('admin/users/edit', {
                error: "Algum erro aconteceu!",
                user,
                userSession
            })
        }
    },

    async delete(req, res) {
        try {
            const userSession = req.user
            await User.delete(req.body.id)

            let results = await User.all()
            const users = results.rows

            if (!users) res.send('Users not found')

            return res.render('admin/users/list', {
                success: "Usuário deletado com sucesso!",
                users,
                userSession
            })

        } catch(err) {
            console.error(err)

            return res.render('admin/users/list', {
                user: req.body,
                error: "Erro ao tentar excluir o usuário!",
                userSession
            })
        }
    }
}