// External dependencies
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Internal dependencies
const Database = require('./Database');

// Init body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Init databases
const databases = {};

// Route list
const routes = {};

/**
 *  Generator
 *  It generates a simple CRUD based on a given Model.
 */
const Generator = Model => {
  /**
   *  getDataFromBody
   *  Gets the column data from the request body.
   */
  const getDataFromBody = (body, shouldIncludeNull = true) =>
    Model.columns.reduce((data, column) => {
      if (shouldIncludeNull || body[column]) {
        data[column] = body[column];
      }
      return data;
    }, {});

  /**
   *  validate
   *  Validates the data based on the Model's validation rules.
   */
  const validate = data => {
    const errors = {};
    Object.keys(Model.validation).forEach(rule => {
      if (!Model.validation[rule].check(data[rule], data, databases)) {
        errors[rule] = Model.validation[rule].message();
      }
    });

    return errors;
  };

  /**
   *  indexResponse
   *  This is the default response for the index route.
   *  It returns all entries from the database.
   */
  const indexResponse = (req, res) => res.send(DB.all());

  /**
   *  storeResponse
   *  This is the default response for the store route.
   *  It validates and stores the data, returning the
   *  newly added row.
   */
  const storeResponse = (req, res) => {
    const data = getDataFromBody(req.body);

    if (Model.validation) {
      const errors = validate(data);
      if (Object.keys(errors).length !== 0) {
        return res.status(500).send(errors);
      }
    }

    return res.send(DB.create(data));
  };

  /**
   *  showResponse
   *  This is the default response for the show route.
   *  It returns the row with the corresponding id.
   */
  const showResponse = (req, res) => {
    const data = DB.select(req.params.id);
    if (!data) res.status(500).send(JSON.stringify(`${Model.name} not found`));

    return res.send(data);
  };

  /**
   *  updateResponse
   *  This is the default response for the update route.
   *  It validates the data, updates the corresponding
   *  row and returns the updated row.
   */
  const updateResponse = (req, res) => {
    const data = getDataFromBody(req.body, false);

    if (Model.validation) {
      const errors = validate(data);
      if (Object.keys(errors).length !== 0) {
        return res.status(500).send(errors);
      }
    }

    const newData = DB.update(req.params.id, data);
    if (!newData) {
      return res.status(500).send(JSON.stringify('Something went wrong'));
    }

    return res.send(newData);
  };

  /**
   *  deleteResponse
   *  This is the default response for the delete route.
   *  It deletes the corresponding row from the
   *  database.
   */
  const deleteResponse = (req, res) => {
    if (!DB.delete(req.params.id)) {
      return res.status(500).send(JSON.stringify('Something went wrong'));
    }

    return res.send(true);
  };

  /**
   *  mockResponse
   *  If you need to mock a response from the server,
   *  you can pass a 'status' and 'response' header
   *  with the request.
   *
   *  status: Number
   *  response: JSON
   */
  const mockResponse = (req, res) => {
    if (req.get('status')) {
      res.status(req.get('status'));
    }
    if (req.get('response')) {
      res.send(JSON.stringify(JSON.parse(req.get('response'))));
      return true;
    }

    return false;
  };

  /** Validates the Model */
  if (!Model.name) throw new Error('Models require a name');
  if (!Model.route) throw new Error('Models require a route');
  if (!Model.columns) throw new Error('Models require a columns');

  /** Registers the new database */
  const DB = (databases[Model.name] = new Database());

  /** Normalizes the route */
  const route = Model.route.toLowerCase().replace(/^\/?|\/?$/, '');

  /** Register route */
  routes[Model.name] = route;

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
  app.get(`/${route}`, (req, res) => {
    if (!mockResponse(req, res)) {
      indexResponse(req, res);
    }
  });

  /**
   *  Store route
   *  POST => /{route}
   */
  app.post(`/${route}`, (req, res) => {
    if (!mockResponse(req, res)) {
      storeResponse(req, res);
    }
  });

  /**
   *  Show route
   *  GET => /{route}/:id
   */
  app.get(`/${route}/:id`, (req, res) => {
    if (!mockResponse(req, res)) {
      showResponse(req, res);
    }
  });

  /**
   *  Update route
   *  PUT => /{route}/:id
   */
  app.put(`/${route}/:id`, (req, res) => {
    if (!mockResponse(req, res)) {
      updateResponse(req, res);
    }
  });

  /**
   *  Update route
   *  PATCH => /{route}/:id
   */
  app.patch(`/${route}/:id`, (req, res) => {
    if (!mockResponse(req, res)) {
      updateResponse(req, res);
    }
  });

  /**
   *  Delete route
   *  DELETE => /{route}/:id
   */
  app.delete(`/${route}/:id`, (req, res) => {
    if (!mockResponse(req, res)) {
      deleteResponse(req, res);
    }
  });
};

module.exports = { app, routes, Generator };
