const db = require('../../config/db')

const Base = require('./Base')
Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async all() {
        try {
            const results = await db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY created_at DESC
            `)

            return results.rows
            
        } catch (error) {
            console.error(error)
        }
    },
    async chefsSelectOptions() {
        try {
            const results = await db.query(`
                SELECT name, id FROM chefs ORDER BY name ASC
            `)
            
            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async find(id) {
        try {
            const results = await db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1
            `, [id])

            return results.rows[0]
            
        } catch (error) {
            console.error(error)
        }
    },
    async userRecipes(userId) {
        try {
            const results = await db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.user_id = $1
            `, [userId])

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    async files(recipeId) {
        try {
            const results = await db.query(`
                SELECT files.id, files.name, files.path
                FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
                WHERE recipes.id = $1
            `, [recipeId])

            return results.rows

        } catch (error) {
            console.error(error)
        }
    },
    paginate(params) {
        try {
            const { filter, limit, offset, callback } = params
    
            let query = "",
                filterQuery = "",
                totalQuery = `(
                    SELECT count(*) FROM recipes
                ) AS total`
    
            if (filter) {
                filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'
                `
    
                totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery}
                ) AS total`
            }
    
            query = `
            SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            ORDER BY updated_at DESC LIMIT $1 OFFSET $2
            `    
            db.query(query, [limit, offset], function(err, results) {
                if (err) throw `Database error! ${err}`
                
                if (results.rowCount == 0) {
                    let notFound = "404"    
                    callback(notFound)
                } else {
                    callback(results.rows)
                }
            })

        } catch (error) {
            console.error(error)
        }
    }
}