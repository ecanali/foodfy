const express = require('express')
const routes = express.Router()

const site = require('../app/controllers/site')

const adminRecipes = require('./admin-recipes')
const adminChefs = require('./admin-chefs')
const users = require('./users')
const profile = require('./profile')

routes.use('/admin/recipes', adminRecipes)
routes.use('/admin/chefs', adminChefs)
routes.use('/admin/users', users)
routes.use('/admin/profile', profile)

// Site - Home = Client
routes.get('/', site.index)
routes.get('/about', function(req, res) {
    return res.render('site/about')
})
routes.get('/recipes', site.recipesList)
routes.get('/recipes/filter', site.filteredRecipesList)
routes.get('/recipes/:id', site.recipeShow)
routes.get('/chefs', site.chefsList)
routes.get('/chefs/:id', site.chefShow)

module.exports = routes