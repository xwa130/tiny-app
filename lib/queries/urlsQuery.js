require('dotenv').config();

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.ENV]);