const router = require('express').Router();

module.exports = (database) => {
  // index
  router.get("/", function (req, res, next) {
    if (req.session.user) {
      database.indexUrls(req.session.user.id, (result) => {
        res.render('urls_index', {'result': result});
      });
    } else {
      next();
    }
  }, function (req, res) {
       res.status(401);
       res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  });
  //new
  router.get('/new', function (req, res, next) {
    if (req.session.user) {
      res.status(200);
      res.render("urls_new");
    } else {
      next();
    }
  }, function (req, res) {
       res.status(401);
       res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  });
  // show
  router.get('/:id', function (req, res, next) {
    if (!req.params.id) {
      res.status(404);
      res.end('Can not find your website.');
    } else {
      next();
    }
  }, function (req, res, next) {
    if (req.session.user) {
      database.showUrl(req.params.id, (result) => {
        if (result.length !== 0) {
          res.status(200);
          res.render('urls_show', {'result': result});
        } else {
          res.status(403);
          res.send('You did not create this short url, please check your <a href = "/urls"> links </a>');
        }
      });
    } else {
      next();
    }
  }, function (req, res) {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  });
  // Create
  router.post('/', function (req, res) {
    if (req.session.user) {
      database
        .createUrl(req)
        .then(() => {
          res.redirect('/urls');
        });
    } else {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    }
  });
  // Update
  router.post('/:id', function (req, res, next) {
    if (!req.params.id) {
      res.status(404);
      res.end('Can not find your website.');
    } else {
      next();
    }
  }, function (req, res) {
    if (req.session.user) {
      database
        .updateUrl(req)
        .then(() => {
          res.redirect('/urls/' + req.params.id);
        });
    } else {
      res.status(401);
      res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
    }
  });
  // Delete
  router.post('/:id/delete', function (req, res, next) {
    if (!req.params.id) {
      res.status(404);
      res.end('Can not find your website.');
    } else {
      next();
    }
  }, function (req, res, next) {
    if (req.session.user) {
      database.deleteUrl(req)
        .then(() => {
          res.redirect('/urls');
        });
    } else {
      next();
    }
  }, function (req, res) {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  });

  return router;
};