const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const ChefsController = require('../app/controllers/chefs')

const UserValidator = require('../app/validators/user')
const ChefValidator = require('../app/validators/chef')

routes.get('/', onlyUsers, ChefsController.index)
routes.get('/create', onlyUsers, UserValidator.isAdmin, ChefsController.create)
routes.get('/:id', onlyUsers, ChefsController.show)
routes.get('/:id/edit', onlyUsers, UserValidator.isAdmin, ChefsController.edit)

routes.post('/', multer.array('photos', 1), onlyUsers, UserValidator.isAdmin, ChefValidator.post, ChefsController.post)
routes.put('/', multer.array('photos', 1), onlyUsers, UserValidator.isAdmin, ChefValidator.update, ChefsController.put)
routes.delete('/', onlyUsers, UserValidator.isAdmin, ChefValidator.hasRecipes, ChefsController.delete)

module.exports = routes