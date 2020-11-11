const User = require('../models/User')

module.exports = {
    index(req, res) {
        return res.render('admin/profile/index', { 
            userSession: req.user,
            user: req.user,
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

            return res.render('admin/profile/index', {
                success: "Conta atualizada com sucesso!",
                user: req.body,
                userSession: req.user
            })

        } catch (error) {
            console.error(error)

            return res.render('admin/profile/index', {
                error: "Algum erro aconteceu!",
                user: req.body,
                userSession: req.user
            })
        }
    }
}