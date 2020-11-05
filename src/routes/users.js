const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/user')
const SessionController = require('../app/controllers/session')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')

// users manager
routes.get('/', onlyUsers, UserValidator.isAdmin, UserController.list)
routes.get('/create', onlyUsers, UserValidator.isAdmin, UserController.create)
routes.post('/', onlyUsers, UserValidator.isAdmin, UserValidator.post, UserController.post)
routes.get('/:id/edit', onlyUsers, UserValidator.isAdmin, UserController.edit)

routes.put('/', onlyUsers, UserValidator.isAdmin, UserController.put)
routes.delete('/', onlyUsers, UserValidator.isAdmin, UserController.delete)

// login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// forgot/reset password
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes