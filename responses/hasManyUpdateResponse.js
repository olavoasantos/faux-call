const { getDataFromBody } = require('../helpers');

/**
 *  hasManyUpdateResponse
 */
const hasManyUpdateResponse = (Model, Relationship) => (req, res) => {
  const data = getDataFromBody(Relationship.columns, req.body, false);

  const errors = Relationship.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).send({errors});
  }

  const row = Relationship.update(parseInt(req.params.relationshipId), {
    ...data,
    [Model.hasMany[Relationship.name]]: parseInt(req.params.id)
  });
  if (!data)
    return res.status(500).send(JSON.stringify('Something went wrong'));

  return res.send(row);
};

module.exports = hasManyUpdateResponse;
