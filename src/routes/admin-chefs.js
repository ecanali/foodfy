const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const chefs = require('../app/controllers/chefs')

const UserValidator = require('../app/validators/user')
const ChefValidator = require('../app/validators/chef')

routes.get('/', onlyUsers, chefs.index)
routes.get('/create', onlyUsers, UserValidator.isAdmin, chefs.create)
routes.get('/:id', onlyUsers, chefs.show)
routes.get('/:id/edit', onlyUsers, UserValidator.isAdmin, chefs.edit)

routes.post('/', multer.array('photos', 1), onlyUsers, UserValidator.isAdmin, ChefValidator.post, chefs.post)
routes.put('/', multer.array('photos', 1), onlyUsers, UserValidator.isAdmin, chefs.put)
routes.delete('/', onlyUsers, UserValidator.isAdmin, chefs.delete)

module.exports = routes