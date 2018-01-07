const sql = require('sql')
const { db } = require('../config')

const table = sql.define({
  name: 'users',
  columns: ['id', 'text']
})

const add = (id, text) => {
  return db.oneOrNone(table.insert({ id, text }).returning('id').toQuery())
}

const get = (id) => {
  return db.oneOrNone(table.select('*').where(table.id.equals(id)).toQuery())
}

const all = (select = '*') => {
  return db.manyOrNone(table.select(select).toQuery())
}

const del = (id) => {
  return db.none(table.delete().where(table.id.equals(id)).toQuery())
}

module.exports = {
  add,
  get,
  all,
  del,
}