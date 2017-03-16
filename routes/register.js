const express = require('express');
const registerRoutes = express.Router();
const bcrypt = require('bcrypt');
const helper = require('../lib/serverHelper.js');
const [urlDatabase, userDatabase] = require('../db/db.js')();

module.exports = () => {
  registerRoutes.get('/', function (req, res) {
    if (req.session.user_id) {
      res.redirect('/');
    } else {
      res.status(200);
      res.render('register');
    }
  });

  registerRoutes.post('/', function (req, res) {
    if (helper.checkEmailRepetitionOrEmpty(req.body.email)) {
      res.status(400).send('Email has existed or is empty.');
    } else {
      let randomUserName = helper.generateRandomString(6);
      const hashed_password = bcrypt.hashSync(req.body.password, 10);
      userDatabase[randomUserName] = {
        id: randomUserName,
        email: req.body.email,
        password: hashed_password
      };
      urlDatabase[randomUserName] = {};
      req.session.user_id = userDatabase[randomUserName];
      res.redirect('/');
    }
  });

  return registerRoutes;
}