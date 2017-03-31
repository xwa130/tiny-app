module.exports = {
  addHTTPHeadIfNo(url) {
    return (url.indexOf("http://") !== 0 || url.indexOf("https://") !== 0) ? 'http://' + url : url;
  }
};