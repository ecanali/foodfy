const express = require('express')
const routes = express.Router()

const { onlyUsers } = require('../app/middlewares/session')

const ProfileController = require('../app/controllers/profile')

const UserValidator = require('../app/validators/user')

routes.get('/', onlyUsers, ProfileController.index)
routes.put('/', onlyUsers, UserValidator.update, ProfileController.put)

module.exports = routes