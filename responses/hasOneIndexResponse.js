/**
 *  hasOneIndexResponse
 */
const hasOneIndexResponse = (Model, Relationship) => (req, res) => {
  const data = Relationship.database.where(Model.hasOne[Relationship.name], parseInt(req.params.id));
  return res.send(data);
};

module.exports = hasOneIndexResponse;
