/**
 *  hasManyIndexResponse
 */
const hasManyIndexResponse = (Model, Relationship) => (req, res) => {
  const data = Relationship.database.whereAll(
    Model.hasMany[Relationship.name],
    parseInt(req.params.id)
  );
  return res.send(data);
};

module.exports = hasManyIndexResponse;
