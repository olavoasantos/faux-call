const App = require('../server');
const Routes = require('./Routes');
const Response = require('../responses');

const CreateRoute = (response, type, route, model) => {
  Routes.register(type.toUpperCase(), route);
  App[type.toLowerCase()](route, Response(response.toLowerCase(), model));
}

const CreateAttributeRoute = (response, type, route, model) => {
  const param = route.split('/').pop();
  Routes.register(type.toUpperCase(), route);
  App[type.toLowerCase()](route, Response(response.toLowerCase() + 'AtributeResponse', model, param));
}

module.exports = {
  Routes,
  CreateRoute,
  CreateAttributeRoute,
}
