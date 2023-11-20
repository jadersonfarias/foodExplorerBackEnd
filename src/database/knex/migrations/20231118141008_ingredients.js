exports.up = (knex) =>
  knex.schema.createTable('ingredients', (table) => {
    table.increments('id')
    table.text('name')

    table.uuid('dish_id').references('id').inTable('dishes').onDelete('CASCADE')
    table.uuid('user_id').references('id').inTable('users')

    table.timestamp('createdAt').default(knex.fn.now())
    table.timestamp('updatedAt').default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable('ingredients')
