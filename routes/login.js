const router = require('express').Router();

module.exports = (database) => {
  router.get('/', function (req, res) {
    if (req.session.user) {
      res.redirect('/');
    } else {
      res.status(200);
      res.render('login');
    }
  });

  router.post('/', function (req, res) {
    database.authLogin(req.body.email, req.body.password, (user) => {
      if(user) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.status(401).send('You are not a user, please <a href = "/register"> register </a> first.');
      }
    });
  });

  router.post('/delete', function (req, res) {
    req.session.user = null;
    res.redirect('/');
  });

  return router;
};