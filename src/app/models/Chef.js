const db = require('../../config/db')

const Base = require('./Base')
Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async all() {
        try {
            const results = await db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                GROUP BY chefs.id
                ORDER BY created_at DESC
            `)

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async find(id) {
        try {
            const results = await db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
            `, [id])
            
            return results.rows[0]

        } catch (error) {
            console.error(error)
        }
    },
    async chefRecipesList(id) {
        try {
            const results = await db.query(`
                SELECT id, chef_id, title 
                FROM recipes 
                WHERE chef_id = $1
                ORDER BY created_at DESC
            `, [id])
            
            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async filesByChefId(chefId) {
        try {
            const results = await db.query(`
                SELECT files.id, files.name, files.path
                FROM files
                LEFT JOIN chefs ON (files.id = chefs.file_id)
                WHERE chefs.id = $1
            `, [chefId])
            
            return results.rows

        } catch (error) {
            console.error(error)
        }
    }
}