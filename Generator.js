// Internal dependencies
const { App, Database, Response, Routes } = require('./Faux');

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
    if (!Model.factory)
      throw new Error(
        `Cannot seed ${Model.name}. Please provide a valid fatory.`,
      );
    Model.factory.create(Model.seed).forEach(item => DB.create(item));
  }

  /**
   *  Index route
   *  GET => /{route}
   */
  App.get(`/${route}`, Response('index', Model));

  /**
   *  Store route
   *  POST => /{route}
   */
  App.post(`/${route}`, Response('store', Model));

  /**
   *  Show route
   *  GET => /{route}/:id
   */
  App.get(`/${route}/:id`, Response('show', Model));

  /**
   *  Update route
   *  PUT => /{route}/:id
   */
  App.put(`/${route}/:id`, Response('update', Model));

  /**
   *  Update route
   *  PATCH => /{route}/:id
   */
  App.patch(`/${route}/:id`, Response('update', Model));

  /**
   *  Delete route
   *  DELETE => /{route}/:id
   */
  App.delete(`/${route}/:id`, Response('delete', Model));
};

module.exports = { App, Routes, Generator };
