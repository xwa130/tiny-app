const router = require('express').Router();

module.exports = (database) => {
  router.get('/', function (req, res) {
    if (req.session.user_id) {
      res.redirect('/');
    } else {
      res.status(200);
      res.render('register');
    }
  });

  router.post('/', function (req, res) {
    database.registerCheckEmailExistence(req.body.email, (bool) => {
      if (bool) {
        database.createUser(req, (id) => {
          req.session.user_id = id;
          res.redirect('/');
        });
      } else {
        res.status(400).send('Email has existed or is empty.');
      }
    });
  });

  return router;
};