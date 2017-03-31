const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'test1',
          email: 'test1@t.t',
          password: bcrypt.hashSync('123456', 10)
        },
        {
          username: 'test2',
          email: 'test2@t.t',
          password: bcrypt.hashSync('123456', 10)
        }
      ]);
    });
};
