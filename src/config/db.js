// Pool removes the need of login/password to each database request
const { Pool } = require('pg')

module.exports = new Pool({
    user: 'ecanali',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'foodfy3'
})