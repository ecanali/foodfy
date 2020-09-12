const User = require('../models/User')
// const { formatCpfCnpj, formatCep } = require('../../lib/utils')

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

        console.log(user)
        return res.render('admin/users/edit', { user })
    },

    async show(req, res) {
        const { user } = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })
    },

    async post(req, res) {
        // return res.send(req.body)

        const userId = await User.create(req.body)
        
        req.session.userId = userId

        return res.redirect('/admin/users/create') // por enquanto, depois direcionar pra lista \/
        // return res.redirect('/admin/users')
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