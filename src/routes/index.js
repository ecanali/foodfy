const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

// Controllers
const site = require('../app/controllers/site')
const chefs = require('../app/controllers/chefs')

const recipes = require('./recipes')
// const users = require('./users')

routes.use('/recipes', recipes)
// routes.use('/admin/recipes', recipes)
// routes.use('/users', users)

// Site - Home = Client
routes.get('/', site.index)
routes.get('/about', function(req, res) {
    return res.render('site/about')
})
routes.get('/recipes', site.recipesList)
routes.get('/recipes/filter', site.filteredRecipesList)
routes.get('/recipes/:id', site.show)
routes.get('/chefs', site.chefsList)

// // Admin - Recipes
// routes.get('/admin/recipes', recipes.index)
// routes.get('/admin/recipes/create', recipes.create)
// routes.get('/admin/recipes/:id', recipes.show)
// routes.get('/admin/recipes/:id/edit', recipes.edit)

// routes.post('/admin/recipes', multer.array('photos', 5), recipes.post)
// routes.put('/admin/recipes', multer.array('photos', 5), recipes.put)
// routes.delete('/admin/recipes', recipes.delete)

// Admin - Chefs
routes.get('/admin/chefs', chefs.index)
routes.get('/admin/chefs/create', chefs.create)
routes.get('/admin/chefs/:id', chefs.show)
routes.get('/admin/chefs/:id/edit', chefs.edit)

routes.post('/admin/chefs', multer.array('photos', 1), chefs.post)
routes.put('/admin/chefs', multer.array('photos', 1), chefs.put)
routes.delete('/admin/chefs', chefs.delete)

module.exports = routes