// Pool serve pra não precisar ficar fornecendo login/senha
// para cada request ao banco de dados
const { Pool } = require('pg')

module.exports = new Pool({
    user: 'ecanali',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
})