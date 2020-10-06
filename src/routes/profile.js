const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/profile')

const { onlyUsers } = require('../app/middlewares/session')

const UserValidator = require('../app/validators/user')

// Rotas de perfil de um usuário logado - OK
routes.get('/', onlyUsers, ProfileController.index)
routes.put('/', onlyUsers, UserValidator.update, ProfileController.put)

module.exports = routes