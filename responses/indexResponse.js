const bcrypt = require('bcryptjs');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

/**
 *  indexResponse
 *  This is the default response for the index route.
 *  It returns all entries from the database.
 */
const indexResponse = Model => (req, res) => {
  let data = Model.all();
  return res.send(data);
};

module.exports = indexResponse;
