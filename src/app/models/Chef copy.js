const db = require('../../config/db')
const { date } = require('../../lib/utils')
const File = require('../models/File')

module.exports = {

    all() {
        try {
            return db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                GROUP BY chefs.id
                ORDER BY created_at DESC`)
        } catch (error) {
            console.error(error)
        }
    },

    create(data, fileId) {
        try {
            const query = `
                INSERT INTO chefs (
                    name,
                    file_id
                ) VALUES ($1, $2)
                RETURNING id
            `
    
            const values = [
                data.name,
                fileId
            ]
    
            return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    },

    find(id) {
        try {
            return db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
            `, [id])
        } catch (error) {
            console.error(error)
        }
    },
   
    chefRecipesList(id) {
        try {
            return db.query(`
                SELECT id, chef_id, title 
                FROM recipes 
                WHERE chef_id = $1
                ORDER BY created_at DESC
            `, [id])
        } catch (error) {
            console.error(error)
        }
    },

    update(data, fileId) {
        try {
            const query = `
                UPDATE chefs SET
                    name = ($1),
                    file_id = ($2)
                WHERE id = $3
            `
    
            const values = [
                data.name,
                fileId,
                data.id
            ]
            
            return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    },

    async delete(ChefId, fileId) {
        try {
            db.query(`DELETE FROM chefs WHERE id = $1`, [ChefId])
    
            await File.removeDeletedAvatarDB(fileId)
            
            return
        } catch (error) {
            console.error(error)
        }
    },

    files(fileId) {
        try {
            return db.query(`
                SELECT files.id, files.name, files.path
                FROM files
                WHERE files.id = $1
            `, [fileId])
        } catch (error) {
            console.error(error)
        }
    },

    filesByChefId(chefId) {
        try {
            return db.query(`
                SELECT files.id, files.name, files.path
                FROM files
                LEFT JOIN chefs ON (files.id = chefs.file_id)
                WHERE chefs.id = $1
            `, [chefId])
        } catch (error) {
            console.error(error)
        }
    }

}