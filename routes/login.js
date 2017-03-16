const express = require('express');
const loginRoutes = express.Router();
const helper = require('../lib/serverHelper.js');
const [urlDatabase, userDatabase] = require('../db/db.js')();

module.exports = () => {
  loginRoutes.get('/', function (req, res) {
    if (req.session.user_id) {
      res.redirect('/');
    } else {
      res.status(200);
      res.render('login');
    }
  });

  loginRoutes.post('/', function (req, res) {
    let retrievedUserId = helper.retrieveUserId(req.body.email, req.body.password);
    if(retrievedUserId) {
      req.session.user_id = retrievedUserId;
      res.redirect('/');
    } else {
      res.status(401).send('You are not a user, please <a href = "/register"> register </a> first.');
    }
  });

  loginRoutes.post('/delete', function (req, res) {
    req.session.user_id = null;
    res.redirect('/');
  });

  return loginRoutes;
};