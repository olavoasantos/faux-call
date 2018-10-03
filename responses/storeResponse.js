const bcrypt = require('bcryptjs');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

/**
 *  storeResponse
 *  This is the default response for the store route.
 *  It validates and stores the data, returning the
 *  newly added row.
 */
const storeResponse = Model => (req, res) => {
  const data = getDataFromBody(Model.columns, req.body);

  const errors = Model.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).send({errors});
  }

  const row = Model.create(data);
  return res.send(row);
};

module.exports = storeResponse;
