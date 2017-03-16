const [urlDatabase, userDatabase] = require('../db/db.js')();

module.exports = {
  generateRandomString(numberOfUrlChara) {
    return (Math.random() + 1).toString(36).substring(2, numberOfUrlChara + 2);
  },

  checkEmailRepetitionOrEmpty(email) {
    for (let key in userDatabase) {
      if (userDatabase[key].email === email || email ===''){
        return true;
      }
    }
    return false;
  },

  retrieveUserId(email, password) {
    for (let key in userDatabase) {
      if (userDatabase[key].email === email &&
        bcrypt.compareSync(password, userDatabase[key].password)){
        return userDatabase[key];
      }
    }
    return false;
  },

  addHTTPHeadIfNo(url) {
    if (url.indexOf("http://") !== 0 || url.indexOf("https://") !== 0) {
      return url = 'http://' + url;
    } else {
      return url;
    }
  }
};