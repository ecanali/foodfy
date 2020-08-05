const Recipe = require('../models/Recipe')

module.exports = {

    index(req, res) {
        Recipe.all(function(recipes) {

            return res.render('admin/recipes/index', { recipes })
        })
    },

    create(req, res) {
        Recipe.chefsSelectOptions(function(options) {

            return res.render('admin/recipes/create', { chefOptions: options })
        })
    },

    post(req, res) {

        // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill out all fields")
        }

        Recipe.create(req.body, function(recipe) {
            
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })

    },

    show(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Recipe not found')

            return res.render('admin/recipes/recipe', { recipe })
        })
    },

    edit(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Recipe not found!')

            Recipe.chefsSelectOptions(function(options) {

                return res.render('admin/recipes/edit', { recipe, chefOptions: options })
            })
        })
    },

    put(req, res) {
        // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill out all fields!")
        }
        
        Recipe.update(req.body, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },

    delete(req, res) {
        Recipe.delete(req.body.id, function() {
            return res.redirect('/admin/recipes')
        })
    }

}
