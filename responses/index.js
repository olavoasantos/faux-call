const {
  mockResponse,
  indexResponse,
  storeResponse,
  showResponse,
  updateResponse,
  deleteResponse,
  showAtributeResponse,
  updateAtributeResponse,
} = require('./BaseResponses');

const responses = {
  'index': indexResponse,
  'store': storeResponse,
  'show': showResponse,
  'update': updateResponse,
  'delete': deleteResponse,
  'showAtributeResponse': showAtributeResponse,
  'updateAtributeResponse': updateAtributeResponse,
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
