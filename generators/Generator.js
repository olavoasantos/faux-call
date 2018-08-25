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
  /** Register route */
  Routes.createGroup(Model.name, Model.route);

  /**
   *  Index route
   *  GET => /{route}
   */
  CreateRoute('index', 'get', `${Model.route}`, Model);

  /**
   *  Store route
   *  POST => /{route}
   */
  CreateRoute('store', 'post', `${Model.route}`, Model);

  /**
   *  Show route
   *  GET => /{route}/:id
   */
  CreateRoute('show', 'get', `${Model.route}/:id`, Model);

  /**
   *  Update route
   *  PUT|PATCH => /{route}/:id
   */
  CreateRoute('update', 'put', `${Model.route}/:id`, Model);
  CreateRoute('update', 'patch', `${Model.route}/:id`, Model);

  /**
   *  Delete route
   *  DELETE => /{route}/:id
   */
  CreateRoute('delete', 'delete', `${Model.route}/:id`, Model);

  if (Model.attributeRoutes) {
    Model.columns.forEach(column => {
      if (!Model.protected.includes(column)) {
        CreateAttributeRoute('show', 'get', `${Model.route}/:id/${column}`, Model);
        CreateAttributeRoute('update', 'patch', `${Model.route}/:id/${column}`, Model);
      }
    });
  }

  if (Model.authenticate) {
    Config.set('authModel', Model);
    Auth();
  }
};

module.exports = Generator;
