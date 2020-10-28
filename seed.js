const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const File = require('./src/app/models/File')
const Recipe = require('./src/app/models/Recipe')

let usersIds = []
let chefsIds = []
let totalUsers = 2
let totalChefs = 2
let totalRecipes = 2

async function createUsers() {
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
}

// createUsers()

async function createChefs() {
    let chefs = []

    while (chefs.length < totalChefs) {
        const fileId = await File.create({
            name: faker.image.image(),
            path: `public/assets/chef-placeholder.jpeg`
        })

        chefs.push({
            name: faker.name.findName(),
            file_id: fileId
        })
    }
    
    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

// createChefs()

async function createRecipes() {
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
    
///// CRIAR LÓGICA DE CRIAR TODOS ARQUIVOS NA DB, DEPOIS CRIAR A RELAÇÃO ALEATORIA ENTRE IDS DAS RECIPES E FILES CRIADOS PRAS IMAGENS DAS RECEITAS!

    // let files = []

    // while (files.length < 2) {
    //     files.push({
    //         name: faker.image.image(),
    //         path: `public/images/placeholder.png`,
    //         product_id: productsIds[Math.floor(Math.random() * totalProducts)]
    //     })
    // }

    // const filesPromise = files.map(file => File.create(file))

    // await Promise.all(filesPromise)
}

// createRecipes()


async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()