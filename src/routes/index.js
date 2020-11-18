const express = require('express')
const routes = express.Router()

const SiteController = require('../app/controllers/site')

const adminRecipes = require('./admin-recipes')
const adminChefs = require('./admin-chefs')
const users = require('./users')
const profile = require('./profile')

routes.use('/admin/recipes', adminRecipes)
routes.use('/admin/chefs', adminChefs)
routes.use('/admin/users', users)
routes.use('/admin/profile', profile)

routes.get('/', SiteController.index)
routes.get('/about', function(req, res) {
    return res.render('site/about')
})
routes.get('/recipes', SiteController.recipesList)
routes.get('/recipes/filter', SiteController.filteredRecipesList)
routes.get('/recipes/:id', SiteController.recipeShow)
routes.get('/chefs', SiteController.chefsList)
routes.get('/chefs/:id', SiteController.chefShow)

module.exports = routes