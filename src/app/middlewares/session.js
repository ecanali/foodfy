const User = require('../models/User')

async function onlyUsers(req, res, next) {
    try {
        if (!req.session.userId)
            return res.redirect('/admin/users/login')
        
        const { userId: id } = req.session
    
        const user = await User.findOne({ where: {id} })
    
        req.user = user
    
        next()
        
    } catch (error) {
        console.error(error)
    }
}

function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId)
        return res.redirect('/admin/users')

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers
}