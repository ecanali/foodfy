const User = require('../models/User')

module.exports = {
    async index(req, res) {
        const userSession = req.user

        return res.render('admin/profile/index', { 
            userSession,
            success: "Sua conta está conectada!"
        })
    },

    async put(req, res) {
        try {
            let { name, email, id } = req.body
    
            await User.update(id, {
                name,
                email,
            })

            const userSession = await User.findOne({ where: {id} })

            if (!userSession) return res.render('admin/profile/index', {
                error: "Erro! Usuário não encontrado!"
            })

            return res.render('admin/profile/index', {
                success: "Conta atualizada com sucesso!",
                userSession
            })

        } catch (error) {
            console.error(error)

            return res.render('admin/profile/index', {
                error: "Algum erro aconteceu!",
                userSession
            })
        }
    }
}