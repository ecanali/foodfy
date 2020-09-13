const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/profile')

// Rotas de perfil de um usuário logado
routes.get('/', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

module.exports = routes