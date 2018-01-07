const pgp = require('pg-promise')()

const cnf = {
  host: 'localhost', // localhost
  port: 5432, // 5432
  database: 'comet',
  user: 'nova',
  password: ''
}

const db = pgp(cnf)

try {
  db.connect()
} catch (e) {
  console.log(e)
}

module.exports = {
  db
}

