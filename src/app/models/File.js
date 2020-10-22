const db = require('../../config/db')

const Base = require('./Base')
Base.init({ table: 'files' })

module.exports = {
    ...Base,
    async relateFileDB(fileId, recipeId) {
        try {
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
    
            return await db.query(query, values)

        } catch (error) {
            console.error(error)  
        }
    },
    removeFromRecipeFilesDB(id) {
        try {
            return db.query(`
                DELETE FROM recipe_files WHERE file_id = $1 
            `, [id])
            
        } catch (error) {
            console.error(error)
        }
    }
}