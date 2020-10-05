const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs') // FileSystem = files/images in public file

module.exports = {
    all() {
        try {
            return db.query(`
                SELECT * FROM users
                ORDER BY created_at DESC`)
        } catch (error) {
            console.error(error)
        }
    },

    find(id) {
        try {
            return db.query(`
                SELECT * FROM users
                WHERE id = $1
            `, [id])
        } catch (error) {
            console.error(error)
        }
    },

    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            // WHERE | OR | AND
            query = `${query}
            ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },

    async create(data, passwordToken) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin
                ) VALUES ($1, $2, $3, $4)
                RETURNING id
            `
    
            // hash of password (using 'bcryptjs' lib)
            const passwordHash = await hash(passwordToken, 8)
    
            const values = [
                data.name,
                data.email,
                passwordHash,
                data.isAdmin || 0
            ]
    
            const results = await db.query(query, values)
            return results.rows[0].id
            
        } catch (error) {
            console.error(error)
        }
    },

    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                // last iteration
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)

        return
    },

    async delete(id) {
        // // gets all products from user
        // let results = await db.query('SELECT * FROM products WHERE user_id = $1', [id])
        // const products = results.rows

        // // from products, gets all imagens
        // const allFilesPromise = products.map(product =>
        //     Product.files(product.id))
        
        // let promiseResults = await Promise.all(allFilesPromise)

        // runs user deletion
        await db.query('DELETE FROM users WHERE id = $1', [id])

        // // removes images from public
        // promiseResults.map(results => {
        //     results.rows.map(file => {
        //         try {
        //             fs.unlinkSync(file.path)
        //         } catch (error) {
        //             console.error(error)
        //         }
        //     }) 
        // })
    }
}