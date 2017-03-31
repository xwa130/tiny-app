require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const knexConfig = require('./knexfile.js');
const knex = require('knex')(knexConfig[process.env.ENV]);
const PORT = process.env.PORT || 3000;
const morgan = require('morgan');
const knexLogger = require('knex-logger');

const urlsDB = require('./lib/queries/urlsQuery');
const usersDB = require('./lib/queries/usersQuery');
const urlsRoutes = require('./routes/urls')(urlsDB);
const loginRoutes = require('./routes/login')(usersDB);
const registerRoutes = require('./routes/register')(usersDB);
const helper = require('./lib/util.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// "dev" = Concise output colored by response status for development use.
// The status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes,
// and uncolored for all other codes.
app.use(morgan('dev'));
app.use(knexLogger(knex));
// user now is globlly usable
app.use(function (req, res, next) {
  res.locals.user = req.session.user || '';
  next();
});

app.use('/urls', urlsRoutes);

app.use('/login', loginRoutes);

app.use('/register', registerRoutes);

app.get('/', function (req, res) {
  if (req.session.user) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get('/u/:short', function (req, res, next) {
  urlsDB.fetchUrl(req.params.short, result => {
    if (result.length !== 0) {
      let longURL = helper.addHTTPHeadIfNo(result[0].long);
      res.redirect(longURL);
    } else {
      next();
    }
  });
}, function (req, res) {
  res.status(404);
  res.end('Can not find your website.');
});

app.listen(PORT, function () {
  console.log(`Tiny app is listening on port ${PORT}!`);
});
