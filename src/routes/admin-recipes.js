const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const RecipesController = require('../app/controllers/recipes')

const RecipeValidator = require('../app/validators/recipe')

routes.get('/', onlyUsers, RecipesController.index)
routes.get('/create', onlyUsers, RecipesController.create)
routes.get('/:id', onlyUsers, RecipesController.show)
routes.get('/:id/edit', onlyUsers, RecipesController.edit)

routes.post('/', multer.array('photos', 5), onlyUsers, RecipeValidator.post, RecipesController.post)
routes.put('/', multer.array('photos', 5), onlyUsers, RecipeValidator.update, RecipesController.put)
routes.delete('/', onlyUsers, RecipesController.delete)

module.exports = routes