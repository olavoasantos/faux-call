const bcrypt = require('bcryptjs');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

const mutate = (Model, data) => {
  if (Model.mutations) {
    Object.keys(data).forEach(key => {
      if (Model.mutations[key]) {
        data[key] = Model.mutations[key](data[key]);
      }
    });
  }

  return data;
};

const encrypt = (Model, data) => {
  if (Model.encrypt) {
    Model.encrypt.forEach(key => {
      if (data[key]) {
        data[key] = bcrypt.hashSync(data[key], 8);
      }
    });
  }

  return data;
};

const hideProtected = (Model, data) => {
  if (Model.protected) {
    Model.protected.forEach(column => {
      delete data[column];
    });
  }

  return data;
};

const getRelationships = (Model, data) => {
  if (Model.hasOne) {
    Object.keys(Model.hasOne).forEach(model => {
      data[model.toLocaleLowerCase()] = Database.select(
        model.toLocaleLowerCase(),
      ).where(Model.hasMany[model], data.id);
    });
  }

  if (Model.hasMany) {
    Object.keys(Model.hasMany).forEach(model => {
      data[model.toLocaleLowerCase()] = Database.select(
        model.toLocaleLowerCase(),
      ).whereAll(Model.hasMany[model], data.id);
    });
  }

  return data;
};
/**
 *  validate
 *  Validates the data based on the Model's validation rules.
 */
const validate = (validation, data) => {
  const errors = {};
  Object.keys(validation).forEach(rule => {
    if (!validation[rule].check(data[rule], data, Database)) {
      errors[rule] = validation[rule].message();
    }
  });

  return errors;
};

/**
 *  indexResponse
 *  This is the default response for the index route.
 *  It returns all entries from the database.
 */
const indexResponse = Model => (req, res) => {
  let data = Model.all();
  return res.send(data);
};

/**
 *  storeResponse
 *  This is the default response for the store route.
 *  It validates and stores the data, returning the
 *  newly added row.
 */
const storeResponse = Model => (req, res) => {
  const data = getDataFromBody(Model.columns, req.body);

  const errors = Model.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(403).send(errors);
  }

  const row = Model.create(data);
  return res.send(row);
};

/**
 *  showResponse
 *  This is the default response for the show route.
 *  It returns the row with the corresponding id.
 */
const showResponse = Model => (req, res) => {
  const data = Model.find(req.params.id);
  if (!data) res.status(500).send(JSON.stringify(`${Model.name} not found`));

  return res.send(data);
};

/**
 *  updateResponse
 *  This is the default response for the update route.
 *  It validates the data, updates the corresponding
 *  row and returns the updated row.
 */
const updateResponse = Model => (req, res) => {
  const data = getDataFromBody(Model.columns, req.body, false);

  const errors = Model.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(500).send(errors);
  }

  const row = Model.update(req.params.id, data);
  if (!data)
    return res.status(500).send(JSON.stringify('Something went wrong'));

  return res.send(row);
};

/**
 *  deleteResponse
 *  This is the default response for the delete route.
 *  It deletes the corresponding row from the
 *  database.
 */
const deleteResponse = Model => (req, res) => {
  if (!Model.delete(req.params.id)) {
    return res.status(500).send(JSON.stringify('Something went wrong'));
  }

  return res.send(true);
};

/**
 *  showAtributeResponse
 */
const showAtributeResponse = (Model, column) => (req, res) => {
  const data = Model.find(req.params.id);
  if (!data) res.status(500).send(JSON.stringify(`${Model.name} not found`));

  return res.send(data[column]);
};

/**
 *  updateAtributeResponse
 */
const updateAtributeResponse = (Model, column) => (req, res) => {
  const data = getDataFromBody([column], req.body, false);

  const errors = Model.validate(data);
  if (Object.keys(errors).length !== 0) {
    return res.status(500).send(errors);
  }

  const row = Model.update(req.params.id, data);
  if (!row) return res.status(500).send(JSON.stringify('Something went wrong'));

  return res.send(Model[column]);
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
    res.send(req.get('response'));
    return true;
  }

  return false;
};

module.exports = {
  mockResponse,
  indexResponse,
  storeResponse,
  showResponse,
  updateResponse,
  deleteResponse,
  showAtributeResponse,
  updateAtributeResponse,
};
