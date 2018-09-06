const App = require('../server');
const Routes = require('./Routes');
const Response = require('../responses');
const Middlewares = require('../middlewares');

const CreateRoute = (response, type, route, model) => {
  Routes.register(type.toUpperCase(), route);

  const middlewares = Middlewares.globals;
  if (model.middlewares) {
    if (Array.isArray(model.middlewares)) {
      model.middlewares.forEach(name => middlewares.push(Middlewares.get(name)));
    }
  }

  App[type.toLowerCase()](route, ...middlewares, Response(response.toLowerCase(), model));
}

const CreateAttributeRoute = (response, type, route, model) => {
  const param = route.split('/').pop();
  Routes.register(type.toUpperCase(), route);

  const middlewares = Middlewares.globals;
  if (model.middleware) {
    if (Array.isArray(model.middleware)) {
      model.middleware.forEach(name => middlewares.push(Middlewares.get(name)));
    }
  }

  App[type.toLowerCase()](route, ...middlewares, Response(response.toLowerCase() + 'AttributeResponse', model, param));
}

const CreateRelationshipRoute = (response, type, route, model, relationship) => {
  Routes.register(type.toUpperCase(), route);

  const middlewares = Middlewares.globals;
  if (model.middleware) {
    if (Array.isArray(model.middleware)) {
      model.middleware.forEach(name => middlewares.push(Middlewares.get(name)));
    }
  }

  App[type.toLowerCase()](route, ...middlewares, Response(response, model, relationship));
}

module.exports = {
  Routes,
  CreateRoute,
  CreateAttributeRoute,
  CreateRelationshipRoute,
}
