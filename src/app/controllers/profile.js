const User = require('../models/User')

module.exports = {
    async index(req, res) {
        const userSession = req.user

        return res.render('admin/profile/index', { 
            userSession,
            user: userSession,
            success: "Sua conta está conectada!"
        })
    },
    async put(req, res) {
        try {
            const userSession = req.user
            
            let { name, email, id } = req.body
    
            await User.update(id, {
                name,
                email,
            })

            return res.render('admin/profile/index', {
                success: "Conta atualizada com sucesso!",
                user: req.body,
                userSession
            })

        } catch (error) {
            console.error(error)

            const userSession = req.user

            return res.render('admin/profile/index', {
                error: "Algum erro aconteceu!",
                user: req.body,
                userSession
            })
        }
    }
}