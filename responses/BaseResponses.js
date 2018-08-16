const Database = require('../database');
  /**
   *  getDataFromBody
   *  Gets the column data from the request body.
   */
  const getDataFromBody = (columns, body, shouldIncludeNull = true) =>
    columns.reduce((data, column) => {
      if (shouldIncludeNull || body[column]) {
        data[column] = body[column];
      }
      return data;
    }, {});

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
  const indexResponse = (Model) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());

    return res.send(DB.all())
  };

  /**
   *  storeResponse
   *  This is the default response for the store route.
   *  It validates and stores the data, returning the
   *  newly added row.
   */
  const storeResponse = (Model) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());
    const data = getDataFromBody(Model.columns, req.body);

    if (Model.validation) {
      const errors = validate(Model.validation, data);
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
  const showResponse = (Model) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());
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
  const updateResponse = (Model) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());
    const data = getDataFromBody(Model.columns, req.body, false);

    if (Model.validation) {
      const errors = validate(Model.validation, data);
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
  const deleteResponse = (Model) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());

    if (!DB.delete(req.params.id)) {
      return res.status(500).send(JSON.stringify('Something went wrong'));
    }

    return res.send(true);
  };

  /**
   *  columnResponse
   */
  const columnResponse = (Model, column) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());
    const data = DB.select(req.params.id);
    if (!data) res.status(500).send(JSON.stringify(`${Model.name} not found`));
    if (!data[column]) res.status(500).send(JSON.stringify(`${column} does not exist`));

    return res.send(data[column]);
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

module.exports = {
  mockResponse, indexResponse, storeResponse, showResponse, updateResponse, deleteResponse, columnResponse,
};