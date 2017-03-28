
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments().primary();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
