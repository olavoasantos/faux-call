/**
 *  deleteResponse
 *  This is the default response for the delete route.
 *  It deletes the corresponding row from the
 *  database.
 */
const deleteResponse = Model => (req, res) => {
  if (!Model.delete(req.params.id)) {
    return res.status(500).send(JSON.stringify('Something went wrong'));
  }

  return res.send(true);
};

module.exports = deleteResponse;