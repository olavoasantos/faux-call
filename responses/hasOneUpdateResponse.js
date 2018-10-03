const { getDataFromBody } = require('../helpers');

/**
 *  hasOneUpdateResponse
 */
const hasOneUpdateResponse = (Model, Relationship) => (req, res) => {
  const data = getDataFromBody(Relationship.columns, req.body, false);
  if (!data)
    return res.status(500).send(JSON.stringify('Something went wrong'));

  const errors = Relationship.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).send({errors});
  }

  const row = Relationship.update(parseInt(req.params.relationshipId), {
    ...data,
    [Model.hasOne[Relationship.name]]: parseInt(req.params.id)
  });
  if (!row) return res.status(500).send(JSON.stringify('Something went wrong during updating'));

  return res.send(row);
};

module.exports = hasOneUpdateResponse;
