exports.up = (knex) =>
  knex.schema.createTable('ingredients', (table) => {
    //table.uuid('id').primary()
    table.increments('id').primary();
    table.text('title')

    //table.uuid('dish_id').references('id').inTable('dishes').onDelete('CASCADE')
    table.integer('dish_id').references('id').inTable('dishes').onDelete('CASCADE')
    table.integer("user_id").references("id").inTable("users")

    table.timestamp('createdAt').default(knex.fn.now())
    table.timestamp('updatedAt').default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable('ingredients')
