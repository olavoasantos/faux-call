const bcrypt = require('bcryptjs');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

/**
 *  showResponse
 *  This is the default response for the show route.
 *  It returns the row with the corresponding id.
 */
const showResponse = Model => (req, res) => {
  const data = Model.find(req.params.id);
  if (!data) res.status(500).send(JSON.stringify(`${Model.name} not found`));

  return res.send(data);
};

module.exports = showResponse;
