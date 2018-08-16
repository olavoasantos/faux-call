const {
  mockResponse, indexResponse, storeResponse, showResponse, updateResponse, deleteResponse,
} = require('./BaseResponses');

const responses = {
  'index': indexResponse,
  'store': storeResponse,
  'show': showResponse,
  'update': updateResponse,
  'delete': deleteResponse,
};

module.exports = (type, Module) => {
  const reponse = responses[type];
  if (!reponse) throw new Error(`Undefined response ${type}`);

  return (req, res) => {
    if (!mockResponse(req, res)) {
      reponse(Module)(req, res);
    }
  };
}
