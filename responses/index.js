const mockResponse = require('./mockResponse');
const showResponse = require('./showResponse');
const indexResponse = require('./indexResponse');
const storeResponse = require('./storeResponse');
const updateResponse = require('./updateResponse');
const deleteResponse = require('./deleteResponse');
const showAtributeResponse = require('./showAttributeResponse');
const updateAtributeResponse = require('./updateAttributeResponse');

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
};
