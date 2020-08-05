const db = require('../../config/db')
const { date } = require('../lib/utils')

module.exports = {

    // O 'all' vai sumir qdo começar a incluir o Filtro e Paginação
    // Acredito que não vale a pena se preocupar em modificar a Query pra BD
    // agora pra trazer o Nome do Chef junto na página de Index, só depois 
    all(callback) {

        db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY title ASC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })

    },

    create(data, callback) {
        
        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now())
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })

    },

    chefsSelectOptions(callback) {
        db.query(`SELECT name, id FROM chefs ORDER BY name ASC`, function(err, results) {
            if(err) throw 'Database error!'

            callback(results.rows)
        })
    },

    find(id, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },

    update(data, callback) {
        const query = `
            UPDATE recipes SET
                chef_id = ($1),
                image = ($2),
                title = ($3),
                ingredients = ($4),
                preparation = ($5),
                information = ($6)
            WHERE id = $7
        `

        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]
        
        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`
                
            callback()
        })
    },

    delete(id, callback) {
        db.query(`
            DELETE FROM recipes
            WHERE id = $1
        `,
        [id],
        function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },

    paginate(params) {
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
        GROUP BY recipes.id, chefs.name LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err, results) {
            if (err) throw 'Database error!'

            callback(results.rows)
        })
    }

}