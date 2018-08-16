const {
  mockResponse, indexResponse, storeResponse, showResponse, updateResponse, deleteResponse, columnResponse,
} = require('./BaseResponses');

const responses = {
  'index': indexResponse,
  'store': storeResponse,
  'show': showResponse,
  'update': updateResponse,
  'delete': deleteResponse,
  'column': columnResponse,
};

module.exports = (type, model, param) => {
  const reponse = responses[type];
  if (!reponse) throw new Error(`Undefined response ${type}`);

  return (req, res) => {
    if (!mockResponse(req, res)) {
      reponse(model, param)(req, res);
    }
  };
}
