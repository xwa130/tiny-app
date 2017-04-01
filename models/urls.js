require('dotenv').config();

const knexConfig = require('../knexfile.js');
const knex = require('knex')(knexConfig[process.env.ENV]);
const shortid = require('shortid');

function  addHTTPHeadIfNo(url) {
  return (url.indexOf("http://") !== 0 || url.indexOf("https://") !== 0) ? 'http://' + url : url;
}

function formUrl(req) {
  let longURL = addHTTPHeadIfNo(req.body.longURL);
  return {
    'short': shortid(),
    'long': longURL,
    'user_id': req.session.user.id
  };
}

module.exports = {
  indexUrls (id, cb) {
    knex('urls')
      .select('id', 'short', 'long')
      .where('user_id', id)
      .then(result => {
        cb(result);
      }).catch(err => {
        console.log('Index error: ', err);
      });
  },

  showUrl (url_id, cb) {
    knex('urls')
      .select('id', 'short', 'long')
      .where('id', url_id)
      .then(result => {
        cb(result);
      }).catch(err => {
        console.log('Show error: ', err);
      });
  },

  createUrl (req) {
    knex('urls')
      .insert(formUrl(req))
      .catch(err => {
        console.log('Create error: ', err);
      });
    return new Promise ((resolve) => {
      resolve();
    });
  },

  updateUrl (req) {
    knex('urls')
      .update('long', req.body.longURL)
      .where('id', req.params.id)
      .catch(err => {
        console.log('Update error: ', err);
      });
    return new Promise (resolve => {
      resolve();
    });
  },

  deleteUrl (req) {
    knex('urls')
      .where('id', req.params.id)
      .del()
      .catch(err => {
        console.log('Delete error: ', err);
      });
    return new Promise(resolve => {
      resolve();
    });
  },

  fetchUrl (short, cb) {
    knex('urls')
      .select('long')
      .where('short', short)
      .then(result => {
        cb(result);
      })
      .catch(err => {
        console.log('Fetch url error: ', err);
      });
  }
};
