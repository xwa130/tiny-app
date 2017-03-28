
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('urls').del()
    .then(function () {
      // Inserts seed entries
      return knex('urls').insert([
        {short: 'abc', long: 'http://www.google.com/', user_id: 1},
        {short: 'def', long: 'http://www.duckduckgo.com/', user_id: 1},
        {short: 'ghi', long: 'http://www.bing.com/', user_id: 2},
        {short: 'jkl', long: 'http://www.yahoo.com/', user_id: 2},
        {short: 'mno', long: 'http://www.ask.com/', user_id: 2}
      ]);
    });
};
