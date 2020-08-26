const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {
    index(req, res) {
        Recipe.all(function(recipes) {

            return res.render('site/index', { recipes })
        })
    },

    recipesList(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 4
        let offset = limit * (page - 1)
    
        const params = {
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
    
                return res.render('site/recipes', { recipes, pagination })
            }
        }
    
        Recipe.paginate(params)
    },

    filteredRecipesList(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 4
        let offset = limit * (page - 1)
    
        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
    
                return res.render('site/filtered-recipes', { recipes, pagination, filter })
            }
        }
    
        Recipe.paginate(params)
    },

    async show(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send('Recipe not found')
        
        return res.render('site/recipe', { recipe })
    },

    chefsList(req, res) {
        Chef.all(function(chefs) {

            return res.render('site/chefs', { chefs })
        })
    },
    
}