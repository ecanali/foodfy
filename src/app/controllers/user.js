const User = require('../models/User')
// const { formatCpfCnpj, formatCep } = require('../../lib/utils')

module.exports = {
    create(req, res) {
        return res.render('admin/users/create')
    },

    async show(req, res) {
        const { user } = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })
    },

    async post(req, res) {
        return res.send(req.body)

        const userId = await User.create(req.body)
        
        req.session.userId = userId

        return res.redirect('/admin/users/create') // por enquanto, depois direcionar pra lista \/
        // return res.redirect('/admin/users')
    },

    async update(req, res) {
        try {
            const { user } = req
            let { name, email, cpf_cnpj, cep, address } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('user/index', {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })

        } catch (error) {
            console.error(error)

            return res.render('user/index', {
                error: "Algum erro aconteceu!"
            })
        }
    },

    async delete(req, res) {
        try {
            await User.delete(req.body.id)

            req.session.destroy()

            return res.render('session/login', {
                success: "Conta deletada com sucesso!"
            })

        } catch(err) {
            console.error(err)

            return res.render('user/index', {
                user: req.body,
                error: "Erro ao tentar excluir sua conta!"
            })
        }
    }
}