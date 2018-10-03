const { getDataFromBody } = require('../helpers');

/**
 *  hasManStorexResponse
 */
const hasManyStoreResponse = (Model, Relationship) => (req, res) => {
  const data = getDataFromBody(Relationship.columns, req.body);

  const errors = Relationship.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).send({errors});
  }

  const row = Relationship.create({
    ...data,
    [Model.hasMany[Relationship.name]]: parseInt(req.params.id)
  });
  return res.send(row);
};

module.exports = hasManyStoreResponse;
