exports.up = (knex) =>
  knex.schema.createTable("dishes", (table) => {
    //table.uuid("id");
    table.increments('id').primary();
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.text("category").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.text("image").default(null);

    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    // table.uuid("user_id").unsigned();

    // table.foreign("user_id").references("users.id");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("dishes");
