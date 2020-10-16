const Base = require('./Base')

const db = require('../../config/db')
const { date } = require('../../lib/utils')
const File = require('../models/File')

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
    // async create(data, fileId) {
    //     try {
    //         const query = `
    //             INSERT INTO chefs (
    //                 name,
    //                 file_id
    //             ) VALUES ($1, $2)
    //             RETURNING id
    //         `
    
    //         const values = [
    //             data.name,
    //             fileId
    //         ]

    //         const results = await db.query(query, values)
    
    //         return results.rows

    //     } catch (error) {
    //         console.error(error)
    //     }
    // },

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

    // async update(data, fileId) {
    //     try {
    //         const query = `
    //             UPDATE chefs SET
    //                 name = ($1),
    //                 file_id = ($2)
    //             WHERE id = $3
    //         `
    
    //         const values = [
    //             data.name,
    //             fileId,
    //             data.id
    //         ]

    //         const results = await db.query(query, values)
            
    //         return results.rows

    //     } catch (error) {
    //         console.error(error)
    //     }
    // },

    // async delete(ChefId, fileId) {
    //     try {
    //         await db.query(`DELETE FROM chefs WHERE id = $1`, [ChefId])
    
    //         await File.removeDeletedAvatarDB(fileId)
            
    //         return
    //     } catch (error) {
    //         console.error(error)
    //     }
    // },
    async files(fileId) {
        try {
            const results = await db.query(`
                SELECT files.id, files.name, files.path
                FROM files
                WHERE files.id = $1
            `, [fileId])
            
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