
exports.up = function(knex, Promise) {
  return knex.schema.createTable('urls', (table) => {
    table.increments().primary();
    table.string('short').notNullable().unique();
    table.string('long').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('urls');
};
