const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const site = require('../app/controllers/site')
const recipes = require('../app/controllers/recipes')

// Home - Client
// routes.get('/recipes', site.recipesList)
// routes.get('/recipes/filter', site.filteredRecipesList)
// routes.get('/recipes/:id', site.show)
// routes.get('/chefs', site.chefsList)

// Admin - Recipes
routes.get('/admin/recipes', recipes.index)
routes.get('/admin/recipes/create', recipes.create)
routes.get('/admin/recipes/:id', recipes.show)
routes.get('/admin/recipes/:id/edit', recipes.edit)

routes.post('/admin/recipes', multer.array('photos', 5), recipes.post)
routes.put('/admin/recipes', multer.array('photos', 5), recipes.put)
routes.delete('/admin/recipes', recipes.delete)

module.exports = routes