const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/user')
const SessionController = require('../app/controllers/session')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')

// Rotas que o administrador irá acessar para gerenciar usuários - OK
routes.get('/', onlyUsers, UserValidator.isAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/create', onlyUsers, UserValidator.isAdmin, UserController.create) // Página de cadastrar um usuário
routes.post('/', onlyUsers, UserValidator.isAdmin, UserValidator.post, UserController.post) // Cadastra um usuário
routes.get('/:id/edit', onlyUsers, UserValidator.isAdmin, UserController.edit) // Página de editar um usuário

routes.put('/', onlyUsers, UserValidator.isAdmin, UserController.put) // Editar um usuário
routes.delete('/', onlyUsers, UserValidator.isAdmin, UserController.delete) // Deletar um usuário

// login / logout OK
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset password / forgot OK
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes