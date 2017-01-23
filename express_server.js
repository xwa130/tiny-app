const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3000; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

let urlDatabase = {

};

let userDatabase = {

};

function generateRandomString(numberOfUrlChara) {
  return (Math.random() + 1).toString(36)
    .substring(2, numberOfUrlChara + 2);
}

function checkEmailRepetitionOrEmpty(email) {
  for (let key in userDatabase) {
    if (userDatabase[key]['email'] === email || email ===''){
      return true;
    }
  }
  return false;
}

function checkEmailAndPassword(email, password) {
  for (let key in userDatabase) {
    if (userDatabase[key]['email'] === email &&
      userDatabase[key]['password'] === password){
      return true;
    }
  }
  return false;
}

function retrieveUserId(email, password) {
  for (let key in userDatabase) {
    if (userDatabase[key]['email'] === email &&
      userDatabase[key]['password'] === password){
      return userDatabase[key];
    }
  }
  return false;
}

app.get('/', function (req, res) {
  if (req.cookies['user_id']) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
})

app.get("/urls", (req, res) => {
  let templateVars = {};
  templateVars['user_id'] = req.cookies["user_id"];
  let loggedInUserId = templateVars['user_id']['id'];
  templateVars['userUrls'] = urlDatabase[loggedInUserId];
  if (templateVars['user_id']) {
    res.status(200);
    res.render("urls_index", templateVars);
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  }
});

app.post('/urls', (req, res) => {
  if (req.cookies["user_id"]) {
    let shortenedURL = generateRandomString(6);
    let userName = req.cookies["user_id"]['id'];
    urlDatabase[userName][shortenedURL] = req.body['longURL'];
    res.redirect("/urls/" + shortenedURL);
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  };
});

app.get('/u/:id', (req, res) => {
  if (!req.params.id) {
    res.status(404);
    res.end('Can not find your website.')
  } else {
    res.redirect(urlDatabase[req.cookies["user_id"]['id']][req.params.id]);
  }
});

app.get('/urls/new', (req, res) => {
  let templateVars = {};
  templateVars['user_id'] = req.cookies["user_id"];
  if (templateVars['user_id']) {
    res.status(200);
    res.render("urls_new", templateVars);
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  }
});

app.get('/urls/:id', (req, res) => {
  if (!req.params.id) {
    res.status(404);
    res.end('Can not find your website.')
  };
  let templateVars = {};
  templateVars['user_id'] = req.cookies["user_id"];
  let loggedInUserId = templateVars['user_id']['id'];
  templateVars['userUrls'] = urlDatabase[loggedInUserId];
  templateVars['requestURL'] = req.params.id;
  if (templateVars['user_id']) {
    if (urlDatabase[templateVars['user_id']['id']].hasOwnProperty(req.params.id)){
      res.status(200);
      res.render('specificURL', templateVars);
    } else {
      res.status(403);
      res.send('You did not register this short url, please check your <a href = "/urls"> links </a>');
    }
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  };
});

app.post('/urls/:id', (req, res) => {
  if (!req.params.id) {
    res.status(404);
    res.end('Can not find your website.')
  };
  let templateVars = {};
  templateVars['user_id'] = req.cookies["user_id"];
  let loggedInUserId = templateVars['user_id']['id'];
  templateVars['userUrls'] = urlDatabase[loggedInUserId];
  if (templateVars['user_id']) {
    if (urlDatabase[templateVars['user_id']['id']].hasOwnProperty(req.params.id)){
      res.status(200);
      urlDatabase[templateVars['user_id']['id']][req.params.id] =
      req.body['longURL'];
      res.redirect('/urls/' + req.params.id)
    } else {
      res.status(403);
      res.send('You did not register this short url, please check your <a href = "/urls"> links </a>');
    }
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  }
});

app.post('/urls/:id/delete', (req, res) => {
  if (!req.params.id) {
    res.status(404);
    res.end('Can not find your website.')
  };
  let templateVars = {};
  templateVars['user_id'] = req.cookies["user_id"];
  let loggedInUserId = templateVars['user_id']['id'];
  templateVars['userUrls'] = urlDatabase[loggedInUserId];
  if (templateVars['user_id']) {
    if (urlDatabase[templateVars['user_id']['id']].hasOwnProperty(req.params.id)){
      res.status(200);
      delete urlDatabase[templateVars['user_id']['id']][req.params.id];
      res.redirect('/urls')
    } else {
      res.status(403);
      res.send('You did not register this short url, please check your <a href = "/urls"> links </a>');
    }
  } else {
    res.status(401);
    res.send("You have not logged in, please log in <a href = '/login'>here</a>.");
  };
});

app.get('/login', (req, res) => {
  if (req.cookies['user_id']) {
    res.redirect('/');
  } else {
    res.status(200);
    res.render('loginform')
  }
});

app.post('/login', (req, res) => {
  if(checkEmailAndPassword(req.body['email'], req.body['password'])) {
  let retrievedUserId = retrieveUserId(req.body['email'], req.body['password']);
  res.cookie('user_id', retrievedUserId);
  res.redirect('/');
  } else {
    res.status(401).send('You are not a user, please <a href = "/register"> register </a> first.');
  }
});

app.get('/register', (req, res) => {
  if (req.cookies['user_id']) {
    res.redirect('/');
  } else {
    res.status(200);
    res.render('register');
  }
});

app.post('/register', (req, res) => {
  if (checkEmailRepetitionOrEmpty(req.body['email'])) {
    res.status(400).send('Email has existed or is empty.');
  } else {
    let randomUserName = generateRandomString(6);
    const hashed_password = bcrypt.hashSync(req.body['password'], 10);
    userDatabase[randomUserName] = {
      id: randomUserName,
      email: req.body['email'],
      password: hashed_password
    };
    urlDatabase[randomUserName] = {};
    console.log(userDatabase[randomUserName]['password']);
    res.cookie('user_id', userDatabase[randomUserName]);
    res.redirect('/');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
