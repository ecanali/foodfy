const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

const { getChefImage, getRecipeImages } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            const recipes = await Recipe.all()

            const recipesPromise = recipes.map(async recipe => {
                const recipeImages = await getRecipeImages(recipe.id, req)
                recipe.img = recipeImages[0]

                return recipe
            }).filter((recipe, index) => index > 5 ? false : true)
    
            const lastAdded = await Promise.all(recipesPromise)

            return res.render('site/index', { recipes: lastAdded })
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipesList(req, res) {
        try {
            let { page, limit } = req.query
    
            page = page || 1
            limit = limit || 4
            let offset = limit * (page - 1)
        
            const params = {
                page,
                limit,
                offset,
                async callback(recipes) {
                    const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    }
        
                    const recipesPromise = recipes.map(async recipe => {
                        const recipeImages = await getRecipeImages(recipe.id, req)
                        recipe.img = recipeImages[0]
        
                        return recipe
                    })
            
                    recipes = await Promise.all(recipesPromise)
        
                    return res.render('site/recipes', { recipes, pagination })
                }
            }
        
            await Recipe.paginate(params)
            
        } catch (error) {
            console.error(error)
        }
    },
    async filteredRecipesList(req, res) {
        try {
            let { filter, page, limit } = req.query
    
            page = page || 1
            limit = limit || 4
            let offset = limit * (page - 1)
        
            const params = {
                filter,
                page,
                limit,
                offset,
                async callback(recipes) {
                    if (recipes == 404)
                        return res.render('site/filter-not-found', { filter })

                    const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    }
        
                    const recipesPromise = recipes.map(async recipe => {
                        const recipeImages = await getRecipeImages(recipe.id, req)
                        recipe.img = recipeImages[0]
        
                        return recipe
                    })
            
                    recipes = await Promise.all(recipesPromise)
                    
                    return res.render('site/filtered-recipes', { 
                        recipes, 
                        pagination, 
                        filter
                    })
                }
            }
        
            await Recipe.paginate(params)
            
        } catch (error) {
            console.error(error)
        }
    },
    async recipeShow(req, res) {
        try {
            const recipe = await Recipe.find(req.params.id)

            recipe.img = await getRecipeImages(recipe.id, req)
    
            return res.render('site/recipe', { recipe })
            
        } catch (error) {
            console.error(error)
        }
    },
    async chefsList(req, res) {
        try {
            const chefs = await Chef.all()

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getChefImage(chef.id, req)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)

            return res.render('site/chefs', { chefs: lastAdded })
        
        } catch (error) {
            console.error(error)
        }
    },
    async chefShow(req, res) {
        try {        
            const chef = await Chef.find(req.params.id)

            const chefImage = await getChefImage(req.params.id, req)
    
            const recipes = await Chef.chefRecipesList(req.params.id)
    
            const recipesPromise = recipes.map(async recipe => {
                const recipeImages = await getRecipeImages(recipe.id, req)
                recipe.img = recipeImages[0]
                
                return recipe
            })
    
            const recipeImages = await Promise.all(recipesPromise)
    
            return res.render('site/chef', { 
                recipes: recipeImages, 
                chef, 
                chefImage 
            })
            
        } catch (error) {
            console.error(error)
        }
    }
}