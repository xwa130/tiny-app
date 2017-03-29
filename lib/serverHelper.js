
module.exports = {
  generateRandomString(numberOfUrlChara) {
    return (Math.random() + 1).toString(36).substring(2, numberOfUrlChara + 2);
  },

  addHTTPHeadIfNo(url) {
    return (url.indexOf("http://") !== 0 || url.indexOf("https://") !== 0) ? 'http://' + url : url;
  }
};