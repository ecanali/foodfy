const Chef = require('../models/Chef')

module.exports = {

    index(req, res) {
        Chef.all(function(chefs) {

            return res.render('admin/chefs/index', { chefs })
        })
    },

    create(req, res) {
        // Chef.chefsSelectOptions(function(options) {

        return res.render('admin/chefs/create')
    },

    post(req, res) {

        // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill out all fields")
        }

        Chef.create(req.body, function(chef) {
            return res.redirect(`/admin/chefs`)

            // return res.redirect(`/admin/chefs/${chef.id}`)
        })

    },

    show(req, res) {
        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send('Chef not found')

            Chef.chefRecipesList(req.params.id, function(recipes) {

                return res.render('admin/chefs/chef', { recipes, chef })
            })
        })
    },

    edit(req, res) {        
        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send('Chef not found!')
            return res.render('admin/chefs/edit', { chef })
        })
    },

    put(req, res) {
        // Separa info do Objeto vindo do form por suas Chaves e testa se n veio vazio
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill out all fields!")
        }
        
        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },

    delete(req, res) {
        if (req.body.totalRecipes > 0) {
            return res.send("Deletion denied, you must delete his/her recipes first!")
        }
        
        Chef.delete(req.body.id, function() {
            return res.redirect('/admin/chefs')
        })
    }

}
