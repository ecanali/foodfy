const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({ filename, path }) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id;
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },

    relateFileDB(fileId, recipeId) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id;
        `

        const values = [
            recipeId,
            fileId
        ]

        return db.query(query, values)
    },

    async delete(id) {
        try {
            let results = await db.query(`
                SELECT files.*
                FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
                WHERE recipes.id = $1
            `, [id])

            const files = results.rows
            files.map(file => {
                fs.unlinkSync(file.path)
                db.query(`
                    DELETE FROM recipe_files WHERE file_id = $1 
                `, [file.id], (err) => {
                    if (err) throw new Error(err)
                    return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
                })
            })
        } catch (err) {
            console.error(err)
        }
    },

    async removeDeletedFileFromPUT(id) {
        try {
            let results = await db.query(`
                SELECT files.*
                FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
                WHERE files.id = $1
            `, [id])

            const files = results.rows
            files.map(file => {
                fs.unlinkSync(file.path)
                db.query(`
                    DELETE FROM recipe_files WHERE file_id = $1 
                `, [file.id], (err) => {
                    if (err) throw new Error(err)
                    return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
                })
            })
        } catch (err) {
            console.error(err)
        }
    },
}