const db = require('../../config/db')
const { date } = require('../../lib/utils')
const File = require('../models/File')

module.exports = {

    all() {
        try {
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY created_at DESC`)
        } catch (error) {
            console.error(error)
        }
    },

    create(data) {
        try {
            const query = `
                INSERT INTO recipes (
                    chef_id,
                    title,
                    ingredients,
                    preparation,
                    information,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `
    
            const values = [
                data.chef,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                date(Date.now())
            ]
    
            return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    },

    chefsSelectOptions() {
        try {
            return db.query(`SELECT name, id FROM chefs ORDER BY name ASC`)
        } catch (error) {
            console.error(error)
        }
    },

    find(id) {
        try {
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1
            `, [id])
        } catch (error) {
            console.error(error)
        }
    },

    update(data) {
        try {
            const query = `
                UPDATE recipes SET
                    chef_id = ($1),
                    title = ($2),
                    ingredients = ($3),
                    preparation = ($4),
                    information = ($5)
                WHERE id = $6
            `
    
            const values = [
                data.chef,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.id
            ]
            
            return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    },

    async delete(id) {
        await File.delete(id)

        try {
            return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
        } catch (error) {
            console.error(error)
        }
    },

    files(recipeId) {
        try {
            return db.query(`
                SELECT files.id, files.name, files.path
                FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
                WHERE recipes.id = $1
            `, [recipeId])
        } catch (error) {
            console.error(error)
        }
    },

    relatedImagesDB(id) {
        try {
            return db.query(`
                SELECT * FROM recipe_files WHERE recipe_id = $1
            `, [id])
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