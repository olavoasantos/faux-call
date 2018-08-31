const { getDataFromBody } = require('../helpers');

/**
 *  updateAtributeResponse
 */
const updateAtributeResponse = (Model, column) => (req, res) => {
  const data = getDataFromBody([column], req.body, false);

  const errors = Model.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(500).send(errors);
  }

  const row = Model.update(req.params.id, data);
  if (!row) return res.status(500).send(JSON.stringify('Something went wrong'));

  return res.send(Model[column]);
};

module.exports = updateAtributeResponse;
