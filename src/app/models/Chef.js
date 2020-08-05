const db = require('../../config/db')
const { date } = require('../lib/utils')


module.exports = {

    // O 'all' vai sumir qdo começar a incluir o Filtro e Paginação
    // Acredito que não vale a pena se preocupar em modificar a Query pra BD
    // agora pra trazer o Nome do Chef junto na página de Index, só depois 
    all(callback) {

        db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            ORDER BY name ASC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })

    },

    create(data, callback) {
        
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now())
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })

    },

    find(id, callback) {
        db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
   
    chefRecipesList(id, callback) {
        db.query(`SELECT id, chef_id, image, title FROM recipes WHERE chef_id = $1`, [id], function(err, results) {
            if(err) throw 'Database error!'

            callback(results.rows)
        })
    },

    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name = ($1),
                avatar_url = ($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]
        
        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`
                
            callback()
        })
    },

    delete(id, callback) {
        db.query(`
            DELETE FROM chefs
            WHERE id = $1
        `,
        [id],
        function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    }

}