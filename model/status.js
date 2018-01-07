const sql = require('sql')
const { db } = require('../config')

const table = sql.define({
  name: 'status',
  columns: ['id', 'status']
})

const add = (id, status) => {
  const request = table
    .insert({ id, status })
    .returning('status')
    .toQuery()

  return db.oneOrNone(request)
}

const get = (id) => {
  const request = table
    .select('*')
    .where(table.id.equals(id))
    .toQuery()

  return db.oneOrNone(request)
}

const set = (id, status) => {
  const request = table
    .update({ status })
    .where(table.id.equals(id))
    .returning('id')
    .toQuery()

  return db.oneOrNone(request)
}

const del = (id) => {
  return db.none(table.delete().where(table.id.equals(id)).toQuery())
}


module.exports = {
  add,
  get,
  set,
  del,
}