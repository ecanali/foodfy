const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    async all() {
        try {
            const results = await db.query(`
                SELECT * FROM users
                ORDER BY name ASC
            `)

            return results.rows
            
        } catch (error) {
            console.error(error)
        }
    }
}