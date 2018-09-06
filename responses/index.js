const Config = require('../config');
const mockResponse = require('./mockResponse');
const showResponse = require('./showResponse');
const indexResponse = require('./indexResponse');
const storeResponse = require('./storeResponse');
const updateResponse = require('./updateResponse');
const deleteResponse = require('./deleteResponse');
const showAttributeResponse = require('./showAttributeResponse');
const updateAttributeResponse = require('./updateAttributeResponse');
const hasManyIndexResponse = require('./hasManyIndexResponse');
const hasManyStoreResponse = require('./hasManyStoreResponse');
const hasManyUpdateResponse = require('./hasManyUpdateResponse');
const hasManyDeleteResponse = require('./hasManyDeleteResponse');
const hasOneIndexResponse = require('./hasOneIndexResponse');
const hasOneStoreResponse = require('./hasOneStoreResponse');
const hasOneUpdateResponse = require('./hasOneUpdateResponse');
const hasOneDeleteResponse = require('./hasOneDeleteResponse');

const responses = {
  'index': indexResponse,
  'store': storeResponse,
  'show': showResponse,
  'update': updateResponse,
  'delete': deleteResponse,
  'showAttributeResponse': showAttributeResponse,
  'updateAttributeResponse': updateAttributeResponse,
  'hasManyIndexResponse': hasManyIndexResponse,
  'hasManyStoreResponse': hasManyStoreResponse,
  'hasManyUpdateResponse': hasManyUpdateResponse,
  'hasManyDeleteResponse': hasManyDeleteResponse,
  'hasOneIndexResponse': hasOneIndexResponse,
  'hasOneStoreResponse': hasOneStoreResponse,
  'hasOneUpdateResponse': hasOneUpdateResponse,
  'hasOneDeleteResponse': hasOneDeleteResponse,
};

module.exports = (type, model, param) => {
  const reponse = responses[type];
  if (!reponse) throw new Error(`Undefined response ${type}`);

  return (req, res) => {
    Config.set('request', req);
    if (!mockResponse(req, res)) {
      reponse(model, param)(req, res);
    }
  };
};
