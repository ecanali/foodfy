const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {

    async index(req, res) {
        try {
            let results = await Recipe.all()
            const recipes = results.rows

            if (!recipes) res.send('Recipes not found')

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(recipe => ({
                    ...recipe,
                    src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                    }))
                    
                return files[0]
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)

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

                    async function getImage(recipeId) {
                        let results = await Recipe.files(recipeId)
                        const files = results.rows.map(recipe => ({
                            ...recipe,
                            src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                            }))
                            
                        return files[0]
                    }
        
                    const recipesPromise = recipes.map(async recipe => {
                        recipe.img = await getImage(recipe.id)
        
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
                    
                    async function getImage(recipeId) {
                        let results = await Recipe.files(recipeId)
                        const files = results.rows.map(recipe => ({
                            ...recipe,
                            src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                            }))
                            
                        return files[0]
                    }
        
                    const recipesPromise = recipes.map(async recipe => {
                        recipe.img = await getImage(recipe.id)
        
                        return recipe
                    })
            
                    recipes = await Promise.all(recipesPromise)
                    
                    return res.render('site/filtered-recipes', { recipes, pagination, filter })
                }
            }
        
            await Recipe.paginate(params)
            
        } catch (error) {
            console.error(error)
        }
    },

    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if (!recipe) return res.send('Recipe not found')
            
            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(recipe => ({
                    ...recipe,
                    src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                    }))
                    
                return files[0]
            }

            recipe.img = await getImage(recipe.id)
    
            return res.render('site/recipe', { recipe })
            
        } catch (error) {
            console.error(error)
        }
    },

    async chefsList(req, res) {
        try {
            let results = await Chef.all()
            const chefs = results.rows
    
            if (!chefs) res.send('Chefs not found')

            async function getImage(chefId) {
                let results = await Chef.filesByChefId(chefId)
                const files = results.rows.map(chef => ({
                    ...chef,
                    src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
                    }))
                    
                return files[0]
            }

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)

            return res.render('site/chefs', { chefs: lastAdded })
        
        } catch (error) {
            console.error(error)
        }
    }
    
}