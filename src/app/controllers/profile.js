const User = require('../models/User')

module.exports = {
    async index(req, res) {
        const { user: userSession } = req
        const user = req.user

        return res.render('admin/profile/index', { userSession, user })
    },

    async put(req, res) {
        try {
            const { user: userSession } = req
            let { name, email, id } = req.body
    
            await User.update(id, {
                name,
                email,
            })

            const user = await User.findOne({ where: {id} })

            if (!user) res.send('User not found')

            return res.render('admin/profile/index', {
                user,
                success: "Conta atualizada com sucesso!",
                userSession
            })

        } catch (error) {
            console.error(error)

            return res.render('admin/profile/index', {
                error: "Algum erro aconteceu!",
                user,
                userSession
            })
        }
    },
}