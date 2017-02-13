const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3000; // default port 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['I will not tell you!'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// urlDatabase example:
//    urlDatabase = {
//      randomUserName: {shor: long}
//    }
let urlDatabase = {};

// userDatabase example:
//  userDatabase = {
//   randomUserName: {
//     id: randomeUserName,
//     email: ,
//     password:
//   },
//   ...
//  }
let userDatabase = {};

function generateRandomString(numberOfUrlChara) {
  return (Math.random() + 1).toString(36).substring(2, numberOfUrlChara + 2);
}

function checkEmailRepetitionOrEmpty(email) {
  for (let key in userDatabase) {
    if (userDatabase[key].email === email || email ===''){
      return true;
    }
  }
  return false;
}

function retrieveUserId(email, password) {
  for (let key in userDatabase) {
    if (userDatabase[key].email === email &&
      bcrypt.compareSync(password, userDatabase[key].password)){
      return userDatabase[key];
    }
  }
  return false;
}

function addHTTPHeadIfNo(url) {
  if (url.indexOf("http://") !== 0 || url.indexOf("https://") !== 0) {
    return url = 'http://' + url;
  } else {
    return url;
  }
}

// For any coming request, check the user identification
// for the convenience of future use
app.use(function (req, res, next) {
  res.locals.user_id = req.session.user_id || '';
  next();
});

app.get('/', function (req, res) {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get("/urls", function (req, res) {
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

app.get('/urls/new', function (req, res) {
  if (req.session.user_id) {
    res.status(200);
    res.render("urls_new");
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  }
});

app.get('/urls/:id', function (req, res) {
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
      res.render('specificURL', templateVars);
    } else {
      res.status(403);
      res.send('You did not create this short url, please check your <a href = "/urls"> links </a>');
    }
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  }
});

app.get('/u/:id', function (req, res) {
  for (let user in urlDatabase) {
    for (let shortURL in urlDatabase[user]) {
      if (req.params.id === shortURL) {
        let longURL = addHTTPHeadIfNo(urlDatabase[user][shortURL]);
        res.redirect(longURL);
      }
    }
  }
  res.status(404);
  res.end('Can not find your website.');
});

// Add a new url to the user's account
app.post('/urls', function (req, res) {
  if (req.session.user_id) {
    let shortenedURL = generateRandomString(6);
    let userName = req.session.user_id.id;
    urlDatabase[userName][shortenedURL] = req.body.longURL;
    res.redirect("/urls/" + shortenedURL);
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  }
});

// Update the url
app.post('/urls/:id', function (req, res) {
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
app.post('/urls/:id/delete', function (req, res) {
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

app.get('/login', function (req, res) {
  if (req.session.user_id) {
    res.redirect('/');
  } else {
    res.status(200);
    res.render('loginform');
  }
});

app.get('/register', function (req, res) {
  if (req.session.user_id) {
    res.redirect('/');
  } else {
    res.status(200);
    res.render('register');
  }
});

app.post('/register', function (req, res) {
  if (checkEmailRepetitionOrEmpty(req.body.email)) {
    res.status(400).send('Email has existed or is empty.');
  } else {
    let randomUserName = generateRandomString(6);
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

app.post('/login', function (req, res) {
  let retrievedUserId = retrieveUserId(req.body.email, req.body.password);
  if(retrievedUserId) {
    req.session.user_id = retrievedUserId;
    res.redirect('/');
  } else {
    res.status(401).send('You are not a user, please <a href = "/register"> register </a> first.');
  }
});

app.post('/logout', function (req, res) {
  req.session.user_id = null;
  res.redirect('/');
});

app.listen(PORT, function () {
  console.log(`Tiny app is listening on port ${PORT}!`);
});
