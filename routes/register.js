const router = require('express').Router();

module.exports = (database) => {
  router.get('/', function (req, res) {
    if (req.session.user) {
      res.redirect('/');
    } else {
      res.status(200);
      res.render('register');
    }
  });

  router.post('/', function (req, res) {
    database.registerCheckEmailExistence(req.body.email, (bool) => {
      if (bool) {
        database.createUser(req, (user) => {
          req.session.user = user;
          res.redirect('/');
        });
      } else {
        res.status(400).send('Email has existed or is empty.');
      }
    });
  });

  return router;
};