const bcrypt = require('bcryptjs');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

/**
 *  updateResponse
 *  This is the default response for the update route.
 *  It validates the data, updates the corresponding
 *  row and returns the updated row.
 */
const updateResponse = Model => (req, res) => {
  const data = getDataFromBody(Model.columns, req.body, false);

  const errors = Model.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).send({errors});
  }

  const row = Model.update(req.params.id, data);
  if (!data)
    return res.status(500).send(JSON.stringify('Something went wrong'));

  return res.send(row);
};

module.exports = updateResponse;
