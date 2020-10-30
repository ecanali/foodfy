const { unlinkSync } = require('fs')
const { hash } = require('bcryptjs')
const crypto = require('crypto')

const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

const mailer = require('../../lib/mailer')

module.exports = {
    async list(req, res) {
        try {
            const users = await User.findAll()
            
            return res.render('admin/users/list', { 
                users, 
                userSession: req.user 
            })
            
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res) {
        return res.render('admin/users/create', { userSession: req.user })
    },
    async post(req, res) {
        try {
            const { name, email, isAdmin } = req.body
    
            // create random password
            const passwordToken = crypto.randomBytes(4).toString("hex")
    
            // send email (by "nodemailer") with auto generated password-token
            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com.br',
                subject: "Sua senha | Foodfy",
                html: `<h2>Segue abaixo sua senha automática, por favor altere assim que possível.</h2>
                    <p>${passwordToken}</p>
                `
            })
    
            // hash of password (using 'bcryptjs' lib)
            const password = await hash(passwordToken, 8)

            const is_admin = isAdmin || 0

            await User.create({ 
                name,
                email,
                password,
                is_admin
            })

            const users = await User.findAll()
    
            return res.render('admin/users/list', {
                users,
                userSession: req.user,
                success: "Usuário cadastrado com sucesso! Senha enviada para o e-mail informado."
            })
            
        } catch (error) {
            console.error(error)

            return res.render('admin/users/create', {
                user: req.body,
                userSession: req.user,
                error: "Erro ao tentar cadastrar o usuário!"
            })
        }
    },
    async edit(req, res) {    
        try {
            const user = await User.find(req.params.id)
    
            return res.render('admin/users/edit', { user, userSession: req.user })
            
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            let { name, email, isAdmin, id } = req.body
    
            await User.update(id, {
                name,
                email,
                is_admin: isAdmin || 0
            })

            const user = await User.find(id)
    
            return res.render('admin/users/edit', {
                userSession: req.user,
                user,
                success: "Conta atualizada com sucesso!",
            })

        } catch (error) {
            console.error(error)

            return res.render('admin/users/edit', {
                error: "Algum erro aconteceu!",
                user: req.body,
                userSession: req.user
            })
        }
    },
    async delete(req, res) {
        try {            
            const userRecipes = await Recipe.userRecipes(req.body.id)

            const deleteAllFromEachRecipePromise = userRecipes.map(async recipe => {
                const recipeFiles = await Recipe.files(recipe.id)

                const deleteFilesPromise = recipeFiles.map(async file => {
                    await File.removeFromRecipeFilesDB(file.id)
                    
                    File.delete(file.id)
    
                    if (!file.path.includes("recipe-placeholder"))
                        unlinkSync(file.path)
                })
    
                await Promise.all(deleteFilesPromise)

                await Recipe.delete(recipe.id)
            })

            await Promise.all(deleteAllFromEachRecipePromise)
            
            await User.delete(req.body.id)

            const users = await User.findAll()

            return res.render('admin/users/list', {
                success: "Usuário deletado com sucesso!",
                users,
                userSession: req.user
            })

        } catch(err) {
            console.error(err)

            const users = await User.findAll()

            return res.render('admin/users/list', {
                users,
                error: "Erro ao tentar excluir o usuário!",
                userSession: req.user
            })
        }
    }
}