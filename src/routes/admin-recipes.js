const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const recipes = require('../app/controllers/recipes')

const RecipeValidator = require('../app/validators/recipe')

routes.get('/', onlyUsers, recipes.index)
routes.get('/create', onlyUsers, recipes.create)
routes.get('/:id', onlyUsers, recipes.show)
routes.get('/:id/edit', onlyUsers, recipes.edit)

routes.post('/', multer.array('photos', 5), onlyUsers, RecipeValidator.post, recipes.post)
routes.put('/', multer.array('photos', 5), onlyUsers, RecipeValidator.update, recipes.put)
routes.delete('/', onlyUsers, recipes.delete)

module.exports = routes