const bcrypt = require('bcryptjs');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

/**
 *  showAtributeResponse
 */
const showAtributeResponse = (Model, column) => (req, res) => {
  const data = Model.find(req.params.id);
  if (!data) res.status(500).send(JSON.stringify(`${Model.name} not found`));

  return res.send(data[column]);
};

module.exports = showAtributeResponse;
