const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/user')
const SessionController = require('../app/controllers/session')

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/create', UserController.create) // Página de cadastrar um usuário
routes.post('/', UserController.post) // Cadastra um usuário
routes.get('/:id/edit', UserController.edit) // Página de editar um usuário

routes.put('/', UserController.put) // Editar um usuário
routes.delete('/', UserController.delete) // Deletar um usuário

//// Rotas de controle de sessão
// login / logout
routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionValidator.login, SessionController.login)
// routes.post('/logout', SessionController.logout)

// // reset password / forgot
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
// routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes