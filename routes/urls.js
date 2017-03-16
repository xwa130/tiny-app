const express = require('express');
const urlsRoutes = express.Router();
const helper = require('../lib/serverHelper.js');
const [urlDatabase, userDatabase] = require('../db/db.js')();

module.exports = () => {

  urlsRoutes.get("/", function (req, res) {
    if (!req.session.user_id) {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    } else {
      let templateVars = {};
      templateVars.userUrls = urlDatabase[req.session.user_id.id];
      res.status(200);
      res.render('urls_index', templateVars);
    }
  });

  urlsRoutes.get('/new', function (req, res) {
    if (req.session.user_id) {
      res.status(200);
      res.render("urls_new");
    } else {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    }
  });

  urlsRoutes.get('/:id', function (req, res) {
    if (!req.params.id) {
      res.status(404);
      res.end('Can not find your website.');
    }

    if (req.session.user_id) {
      let templateVars = {};
      templateVars.userUrls = urlDatabase[req.session.user_id.id];
      templateVars.requestURL = req.params.id;
      if (templateVars.userUrls.hasOwnProperty(req.params.id)){
        res.status(200);
        res.render('urls_show', templateVars);
      } else {
        res.status(403);
        res.send('You did not create this short url, please check your <a href = "/urls"> links </a>');
      }
    } else {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    }
  });

  // Add a new url to the user's account
  urlsRoutes.post('/', function (req, res) {
    if (req.session.user_id) {
      let shortenedURL = helper.generateRandomString(6);
      let userName = req.session.user_id.id;
      console.log('database is ', urlDatabase);
      console.log(urlDatabase[userName]);
      urlDatabase[userName][shortenedURL] = req.body.longURL;
      res.redirect("/urls/" + shortenedURL);
    } else {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    }
  });

  // Update the url
  urlsRoutes.post('/:id', function (req, res) {
    if (!req.params.id) {
      res.status(404);
      res.end('Can not find your website.');
    }
    if (req.session.user_id) {
      let urls = urlDatabase[req.session.user_id.id];
      if (urls.hasOwnProperty(req.params.id)){
        res.status(200);
        urls[req.params.id] = req.body.longURL;
        res.redirect('/urls/' + req.params.id);
      } else {
        res.status(403);
        res.send('You did not register this short url, please check your <a href = "/urls"> links </a>');
      }
    } else {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    }
  });

  // Delete a url
  urlsRoutes.post('/:id/delete', function (req, res) {
    if (!req.params.id) {
      res.status(404);
      res.end('Can not find your website.');
    }
    if (req.session.user_id) {
      let urls = urlDatabase[req.session.user_id.id];
      if (urls.hasOwnProperty(req.params.id)){
        res.status(200);
        delete urls[req.params.id];
        res.redirect('/urls');
      } else {
        res.status(403);
        res.send('You did not register this short url, please check your <a href = "/urls"> links </a>');
      }
    } else {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    }
  });

  return urlsRoutes;
};