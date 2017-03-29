const router = require('express').Router();

module.exports = (database) => {
  router.get('/', function (req, res) {
    if (req.session.user_id) {
      res.redirect('/');
    } else {
      res.status(200);
      res.render('login');
    }
  });

  router.post('/', function (req, res) {
    database.authLogin(req.body.email, req.body.password, (id) => {
      if(id) {
        req.session.user_id = id;
        res.redirect('/');
      } else {
        res.status(401).send('You are not a user, please <a href = "/register"> register </a> first.');
      }
    });
  });

  router.post('/delete', function (req, res) {
    req.session.user_id = null;
    res.redirect('/');
  });

  return router;
};