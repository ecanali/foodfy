const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    async list(req, res) {
        try {
            let results = await User.all()
            const users = results.rows
    
            if (!users) res.send('Users not found')
        
            return res.render('admin/users/list', { users })
            
        } catch (error) {
            console.error(error)
        }
    },

    create(req, res) {
        return res.render('admin/users/create')
    },

    async edit(req, res) {    
        let results = await User.find(req.params.id)
        const user = results.rows[0]

        if (!user) return res.send('User not found!')

        return res.render('admin/users/edit', { user })
    },

    async show(req, res) {
        const { user } = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })
    },

    async post(req, res) {
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

        const userId = await User.create(req.body, passwordToken)
        
        // req.session.userId = userId

        return res.redirect('/admin/users')
    },

    async put(req, res) {
        try {
            let { name, email, isAdmin } = req.body
    
            await User.update(req.body.id, {
                name,
                email,
                is_admin: isAdmin || 0
            })

            let results = await User.all()
            const users = results.rows

            if (!users) res.send('Users not found')

            return res.render('admin/users/list', {
                user: req.body,
                success: "Conta atualizada com sucesso!",
                users
            })

        } catch (error) {
            console.error(error)

            return res.render('admin/users/list', {
                error: "Algum erro aconteceu!"
            })
        }
    },

    async delete(req, res) {
        try {
            await User.delete(req.body.id)

            // req.session.destroy()

            let results = await User.all()
            const users = results.rows

            if (!users) res.send('Users not found')

            return res.render('admin/users/list', {
                success: "Usuário deletado com sucesso!",
                users
            })

        } catch(err) {
            console.error(err)

            return res.render('admin/users/list', {
                user: req.body,
                error: "Erro ao tentar excluir o usuário!"
            })
        }
    }
}