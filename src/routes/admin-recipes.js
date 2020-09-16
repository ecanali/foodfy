const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const recipes = require('../app/controllers/recipes')

routes.get('/', onlyUsers, recipes.index)
routes.get('/create', onlyUsers, recipes.create)
routes.get('/:id', onlyUsers, recipes.show)
routes.get('/:id/edit', onlyUsers, recipes.edit)

routes.post('/', multer.array('photos', 5), recipes.post)
routes.put('/', multer.array('photos', 5), recipes.put)
routes.delete('/', recipes.delete)

module.exports = routes