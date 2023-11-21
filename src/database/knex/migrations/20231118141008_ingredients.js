exports.up = (knex) =>
  knex.schema.createTable('ingredients', (table) => {
    table.uuid('id').primary()
    table.text('name')

    table.uuid('dish_id').references('id').inTable('dishes').onDelete('CASCADE')


    table.timestamp('createdAt').default(knex.fn.now())
    table.timestamp('updatedAt').default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable('ingredients')
