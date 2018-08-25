const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const App = require('../server');
const Config = require('../config');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

const Auth = () => {
  const Model = Config.get('authModel');
  const namespace = `${Config.get('auth.namespace').toLowerCase().replace(/^\/?|\/?$/, '')}`;
  const prefix = namespace ? `/${namespace}` : namespace;

  App.post(`${prefix}/register`, (req, res) => {
    const data = getDataFromBody(Model.columns, req.body);

    const errors = Model.validate(data);
    if (Object.keys(errors).length !== 0) {
      return res.status(500).send(errors);
    }

    const registered = Model.create(data);
    const token = jwt.sign({ id: registered.id, created_at: registered.created_at }, Config.get('secret'), { expiresIn: 86400 });

    res.send({ auth: true, token });
  });

  App.post(`${prefix}/login`, (req, res) => {
    let data = getDataFromBody(Model.authenticate, req.body);

    data = Model.mutate(data);

    let registered;
    Model.authenticate.forEach(column => {
      if (!Model.encrypt || (Model.encrypt && !Model.encrypt.includes(column))) {
        registered = Model.database.where(column, data[column]);
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
      if (!checkField) return res.status(401).send({ message: `Invalid ${column}` });
    });

    const token = jwt.sign({ id: registered.id, created_at: registered.created_at }, Config.get('secret'), { expiresIn: 86400 });
    res.send({ auth: true, token });
  });

  App.post(`${prefix}/logout`, (req, res) => {
    res.send({ auth: false, token: null });
  });
};

module.exports = Auth;