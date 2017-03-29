require('dotenv').config();

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.ENV]);
const bcrypt = require('bcrypt');

function formUser(req) {
  return {
    'username': req.body.username,
    'email': req.body.email,
    'password': bcrypt.hashSync(req.body.password, 10)
  };
}

module.exports = {
  registerCheckEmailExistence (email, cb) {
    knex('users')
      .where('email', email)
      .then(result => {
        cb(result.length !== 0);
      })
      .catch(err => {
        console.log('Checking email error: ', err);
      });
  },

  authLogin (email, psw, cb) {
    knex('users')
      .where('email', email)
      .then(result => {
        if (result.length !== 0) {
          return bcrypt.compareSync(psw, result[0].password) ? result[0].id : false;
        } else {
          return false;
        }
      })
      .then(result => {
        cb(result);
      });
  },

  createUser (req, cb) {
    knex('users')
      .insert(formUser(req))
      .returning('id')
      .then((result) => {
        cb(result(0));
      })
      .catch(err => {
        console.log('Creating user error: ', err);
      });
  }
};
