const { getDataFromBody } = require('../helpers');

/**
 *  hasOneDeleteResponse
 */
const hasOneDeleteResponse = (Model, Relationship) => (req, res) => {
  const row = Relationship.database.where('id', parseInt(req.params.relationshipId));
  if (!row) return res.status(500).send(JSON.stringify(`${Relationship.name} not found`));
  if (row[Model.hasMany[Relationship.name]] !== req.params.id) return res.status(500).send(JSON.stringify(`${Relationship.name} does not belong to specified ${Model.name}`));

  if (!Relationship.delete(parseInt(req.params.relationshipId))) {
    return res.status(500).send(JSON.stringify('Something went wrong during deleting'));
  }

  return res.send(true);
};

module.exports = hasOneDeleteResponse;
