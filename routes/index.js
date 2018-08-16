const App = require('../server');
const Routes = require('./Routes');
const Response = require('../responses');

const CreateRoute = (response, type, route, model) => {
  const param = response !== 'column' ? null : route.split('/').pop();
  Routes.register(type.toUpperCase(), route);
  App[type.toLowerCase()](route, Response(response.toLowerCase(), model, param));
}

module.exports = {
  Routes,
  CreateRoute,
}
