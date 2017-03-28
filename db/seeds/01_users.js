
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'test1', email: 'test1@t.t', password: '123456'},
        {username: 'test2', email: 'test2@t.t', password: '123456'},
      ]);
    });
};
