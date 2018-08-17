// External dependencies
const { factory, manager } = require('node-factory');

// Internal dependencies
const Response = require('../responses');
const Database = require('../database');
const App = require('../server');
const Auth = require('../auth');
const Config = require('../config');
const { Routes, CreateRoute, CreateAttributeRoute } = require('../routes');

/**
 *  Generator
 *  It generates a simple CRUD based on a given Model.
 */
const Generator = Model => {
  /** Validates the Model */
  if (!Model.name) throw new Error('Models require a name');
  if (!Model.route) throw new Error('Models require a route');
  if (!Model.columns) throw new Error('Models require a columns');

  /** Creates and registers the new database */
  const DB = Database.create(Model.name.toLowerCase());

  /** Normalizes the route */
  const route = Model.route.toLowerCase().replace(/^\/?|\/?$/, '');

  /** Register route */
  Routes.createGroup(Model.name, route);

  /** Seeds the database based on the Model factory */
  if (Model.seed && Model.seed > 0) {
    if (!Model.factory) throw new Error(`Cannot seed ${Model.name}. Please provide a valid fatory.`);
    manager.register(`@${Model.name}`, Model.factory);
    factory(`@${Model.name}`).create(Model.seed).forEach(item => DB.create(item));
  }

  /**
   *  Index route
   *  GET => /{route}
   */
  CreateRoute('index', 'get', `/${route}`, Model);

  /**
   *  Store route
   *  POST => /{route}
   */
  CreateRoute('store', 'post', `/${route}`, Model);

  /**
   *  Show route
   *  GET => /{route}/:id
   */
  CreateRoute('show', 'get', `/${route}/:id`, Model);

  /**
   *  Update route
   *  PUT|PATCH => /{route}/:id
   */
  CreateRoute('update', 'put', `/${route}/:id`, Model);
  CreateRoute('update', 'patch', `/${route}/:id`, Model);

  /**
   *  Delete route
   *  DELETE => /{route}/:id
   */
  CreateRoute('delete', 'delete', `/${route}/:id`, Model);

  if (Model.attributeRoutes) {
    Model.columns.forEach(column => {
      if (!Model.protected || !Model.protected.includes(column)) {
        CreateAttributeRoute('show', 'get', `/${route}/:id/${column}`, Model);
        CreateAttributeRoute('update', 'patch', `/${route}/:id/${column}`, Model);
      }
    });
  }

  if (Model.authenticate) {
    Config.set('authModel', Model);
    Auth();
  }
};

module.exports = Generator;
