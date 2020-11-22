const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const File = require('./src/app/models/File')
const Recipe = require('./src/app/models/Recipe')

let usersIds = [],
    chefsIds = [],
    totalUsers = 6,
    totalChefs = 6,
    totalRecipes = 12,
    totalRecipesImages = 36

async function createUsers() {
    try {
        const users = []
        const password = await hash('1111', 8)
    
        while (users.length < totalUsers) {
            users.push({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password,
                is_admin: faker.random.boolean()
            })
        }
    
        const usersPromise = users.map(user => User.create(user))
    
        usersIds = await Promise.all(usersPromise)
        
    } catch (error) {
        console.error(error)
    }
}

async function createChefs() {
    try {
        let chefs = []
    
        while (chefs.length < totalChefs) {
            const fileId = await File.create({
                name: faker.image.image(),
                path: `public/images/chef-placeholder${Math.ceil(Math.random() * 6)}.jpeg`
            })
    
            chefs.push({
                name: faker.name.findName(),
                file_id: fileId
            })
        }
        
        const chefsPromise = chefs.map(chef => Chef.create(chef))
    
        chefsIds = await Promise.all(chefsPromise)
        
    } catch (error) {
        console.error(error)
    }
}

async function createRecipes() {
    try {
        let recipes = []
    
        while (recipes.length < totalRecipes) {
            recipes.push({
                chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
                title: faker.name.title(),
                ingredients: `{${faker.random.arrayElements()}}`,
                preparation: `{${faker.random.arrayElements()}}`,
                information: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
                user_id: usersIds[Math.floor(Math.random() * totalUsers)]
            })
        }
        
        const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    
        let recipesIds = await Promise.all(recipesPromise)
        
        let files = []
    
        while (files.length < totalRecipesImages) {
            files.push({
                name: faker.image.image(),
                path: `public/images/recipe-placeholder${Math.ceil(Math.random() * 6)}.png`
            })
        }
    
        const filesPromise = files.map(async file => {
            const fileId = await File.create(file)
    
            await File.relateFileDB(fileId, recipesIds[Math.floor(Math.random() * totalRecipes)])
        })
    
        await Promise.all(filesPromise)
        
    } catch (error) {
       console.error(error) 
    }
}

async function init() {
    try {
        await createUsers()
        await createChefs()
        await createRecipes()
        
    } catch (error) {
       console.log(error) 
    }
}

init()