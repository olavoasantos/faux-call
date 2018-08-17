const bcrypt = require('bcryptjs');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');
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
    let data = DB.all();

    if (Model.protected) {
      data = data.map(row => {
        Model.protected.forEach(column => {
          delete row[column];
        })

        return row;
      });
    }

    if (Model.hasOne) {
      data = data.map(row => {
        Object.keys(Model.hasOne).forEach(model => {
          row[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).where(Model.hasMany[model], row.id);
        });

        return row;
      });
    }

    if (Model.hasMany) {
      data = data.map(row => {
        Object.keys(Model.hasMany).forEach(model => {
          row[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).whereAll(Model.hasMany[model], row.id);
        });

        return row;
      });
    }

    return res.send(data)
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

    if (Model.mutations) {
      Object.keys(data).forEach(key => {
        if (Model.mutations[key]) {
          data[key] = Model.mutations[key](data[key]);
        }
      });
    }

    if (Model.encrypt) {
      Model.encrypt.forEach(key => {
        if (data[key]) {
          data[key] = bcrypt.hashSync(data[key], 8);
        }
      })
    }

    const registered = DB.create(data);

    if (Model.protected) {
      Model.protected.forEach(column => {
        delete registered[column];
      });
    }

    if (Model.hasOne) {
      Object.keys(Model.hasOne).forEach(model => {
        data[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).where(Model.hasMany[model], data.id);
      });
    }

    if (Model.hasMany) {
      Object.keys(Model.hasMany).forEach(model => {
        data[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).whereAll(Model.hasMany[model], data.id);
      });
    }

    return res.send(registered);
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

    if (Model.protected) {
      Model.protected.forEach(column => {
        delete data[column];
      });
    }

    if (Model.hasOne) {
      Object.keys(Model.hasOne).forEach(model => {
        data[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).where(Model.hasMany[model], data.id);
      });
    }

    if (Model.hasMany) {
      Object.keys(Model.hasMany).forEach(model => {
        data[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).whereAll(Model.hasMany[model], data.id);
      });
    }

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

    if (Model.mutations) {
      Object.keys(data).forEach(key => {
        if (Model.mutations[key]) {
          data[key] = Model.mutations[key](data[key]);
        }
      });
    }

    if (Model.encrypt) {
      Model.encrypt.forEach(key => {
        if (data[key]) {
          data[key] = bcrypt.hashSync(data[key], 8);
        }
      })
    }

    const newData = DB.update(req.params.id, data);
    if (!newData) {
      return res.status(500).send(JSON.stringify('Something went wrong'));
    }

    if (Model.protected) {
      Model.protected.forEach(column => {
        delete newData[column];
      });
    }

    if (Model.hasOne) {
      Object.keys(Model.hasOne).forEach(model => {
        data[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).where(Model.hasMany[model], data.id);
      });
    }

    if (Model.hasMany) {
      Object.keys(Model.hasMany).forEach(model => {
        data[model.toLocaleLowerCase()] = Database.select(model.toLocaleLowerCase()).whereAll(Model.hasMany[model], data.id);
      });
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
   *  showAtributeResponse
   */
  const showAtributeResponse = (Model, column) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());
    const data = DB.select(req.params.id);
    if (!data) res.status(500).send(JSON.stringify(`${Model.name} not found`));

    return res.send(data[column]);
  };

  /**
   *  updateAtributeResponse
   */
  const updateAtributeResponse = (Model, column) => (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());
    const data = getDataFromBody([column], req.body, false);

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

    return res.send(newData[column]);
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