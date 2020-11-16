const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')

const { getChefImage, getRecipeImages } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            const chefs = await Chef.all()

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getChefImage(chef.id, req)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                userSession: req.user 
            })
            
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res) {
        const userSession = req.user

        return res.render('admin/chefs/create', { userSession })
    },
    async post(req, res) {
        try {
            const filesPromise = req.files.map(file => 
                File.create({ 
                    name: file.filename,
                    path: file.path
                })
            )

            const filesResults = await Promise.all(filesPromise)

            await Chef.create({ 
                name: req.body.name,
                file_id: filesResults[0]
            })
        
            // index render requirements
            const chefs = await Chef.all()

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getChefImage(chef.id, req)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                userSession: req.user,
                success: "Chef criado com sucesso!"
            })
            
        } catch (error) {
            console.error(error)

            return res.render('admin/chefs/create', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                userSession: req.user
            })
        }
    },
    async show(req, res) {
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

            return res.render('admin/chefs/chef', { 
                recipes: recipeImages, 
                chef, 
                chefImage, 
                userSession: req.user
            })
            
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {   
        try {
            const chef = await Chef.find(req.params.id)
    
            const chefImage = await getChefImage(req.params.id, req)
    
            return res.render('admin/chefs/edit', { 
                chef, 
                chefImage, 
                userSession: req.user
            })

        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            if (req.files.length != 0) {
                const filesPromise = req.files.map(file => 
                    File.create({ 
                        name: file.filename,
                        path: file.path
                    })
                )

                const filesResults = await Promise.all(filesPromise)

                await Chef.update(req.body.id, {
                    name: req.body.name,
                    file_id: filesResults[0]
                })
    
                // remove old file from db and assets
                const oldFile = await File.find(req.body.file_id)
                
                File.delete(oldFile.id)
        
                if (!oldFile.path.includes("chef-placeholder"))
                    unlinkSync(oldFile.path)

            } else {
                await Chef.update(req.body.id, {
                    name: req.body.name
                })
            }

            // show render requirements
            const chef = await Chef.find(req.body.id)

            const chefImage = await getChefImage(req.body.id, req)

            const recipes = await Chef.chefRecipesList(req.body.id)
    
            const recipesPromise = recipes.map(async recipe => {
                const recipeImages = await getRecipeImages(recipe.id, req)
                recipe.img = recipeImages[0]
    
                return recipe
            })
    
            const recipeImages = await Promise.all(recipesPromise)

            return res.render('admin/chefs/chef', { 
                recipes: recipeImages, 
                chef, 
                chefImage, 
                userSession: req.user,
                success: "Chef atualizado com sucesso!"
            })
            
        } catch (error) {
            console.error(error)

            const chefImage = await getChefImage(req.params.id, req)

            return res.render('admin/chefs/edit', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                chefImage,
                userSession: req.user
            })
        }
    },
    async delete(req, res) {        
        try {           
            await Chef.delete(req.body.id)

            // remove old file from db and assets
            const oldFile = await File.find(req.body.file_id)
                
            File.delete(oldFile.id)

            if (!oldFile.path.includes("chef-placeholder"))
                unlinkSync(oldFile.path)

            // index render requirements
            const chefs = await Chef.all()

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getChefImage(chef.id, req)

                return chef
            })
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render('admin/chefs/index', { 
                chefs: lastAdded, 
                success: "Chef deletado com sucesso!",
                userSession: req.user
            })
            
        } catch (error) {
            console.error(error)

            const chefImage = await getChefImage(req.body.id, req)

            return res.render('admin/chefs/edit', {
                error: "Algum erro aconteceu!",
                chef: req.body,
                chefImage,
                userSession: req.user
            })
        }
    }
}