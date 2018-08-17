const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const App = require('../server');
const Config = require('../config');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

const Auth = (Model) => {
  App.post('/register', (req, res) => {
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
    const token = jwt.sign({ id: registered.id, created_at: registered.created_at }, Config.secret, { expiresIn: 86400 });

    res.send({ auth: true, token });
  });

  App.post('/login', (req, res) => {
    const DB = Database.select(Model.name.toLowerCase());
    const data = getDataFromBody(Model.authenticate, req.body);

    if (Model.mutations) {
      Object.keys(data).forEach(key => {
        if (Model.mutations[key]) {
          data[key] = Model.mutations[key](data[key]);
        }
      });
    }

    let registered;
    Model.authenticate.forEach(column => {
      if (!Model.encrypt || (Model.encrypt && !Model.encrypt.includes(column))) {
        registered = DB.where(column, data[column]);
      }
    });
    if (!registered) return res.status(401).send({ auth: false, token: null, message: 'User not found' });

    Model.authenticate.forEach(column => {
      let checkField;
      if (Model.encrypt && Model.encrypt.includes(column)) {
        checkField = bcrypt.compareSync(data[column], registered[column]);
      } else {
        checkField = data[column] === registered[column];
      }
      if (!checkField) return res.status(401).send({ auth: false, token: null, message: `Invalid ${column}` });
    });

    const token = jwt.sign({ id: registered.id, created_at: registered.created_at }, Config.secret, { expiresIn: 86400 });
    res.send({ auth: true, token });
  });

  App.post('/logout', (req, res) => {
    res.send({ auth: false, token: null });
  });
};

module.exports = Auth;