const express = require('express')
const routes = express.Router()
// const multer = require('../app/middlewares/multer')

const UserController = require('../app/controllers/user')

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/create', UserController.create) // Página de cadastrar um usuário
routes.post('/', UserController.post) // Cadastra um usuário
routes.get('/:id/edit', UserController.edit) // Página de editar um usuário

routes.put('/', UserController.put) // Editar um usuário
routes.delete('/', UserController.delete) // Deletar um usuário

module.exports = routes