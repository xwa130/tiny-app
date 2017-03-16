const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const PORT = process.env.PORT || 3000; // default port 3000
const urlsRoutes = require('./routes/urls')();
const loginRoutes = require('./routes/login')();
const registerRoutes = require('./routes/register')();
const helper = require('./lib/serverHelper.js');
const [urlDatabase, userDatabase] = require('./db/db.js')();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['I will not tell you!'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
// user_id now is globlly usable
app.use(function (req, res, next) {
  res.locals.user_id = req.session.user_id || '';
  next();
});

app.use('/urls', urlsRoutes);

app.use('/login', loginRoutes);

app.use('/register', registerRoutes);

app.get('/', function (req, res) {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get('/u/:id', function (req, res) {
  for (let user in urlDatabase) {
    for (let shortURL in urlDatabase[user]) {
      if (req.params.id === shortURL) {
        let longURL = helper.addHTTPHeadIfNo(urlDatabase[user][shortURL]);
        res.redirect(longURL);
      }
    }
  }
  res.status(404);
  res.end('Can not find your website.');
});

app.listen(PORT, function () {
  console.log(`Tiny app is listening on port ${PORT}!`);
});
