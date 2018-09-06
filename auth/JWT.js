const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Config = require('../config');
const { getDataFromBody } = require('../helpers');

const JWT = {
  parseToken: token => {
    console.log(token);
    return token;
  },
  sign: data => {
    const SECRET = Config.get('auth.secret');
    const EXPIRATION = Config.get('auth.expiration');

    return jwt.sign(data, SECRET, { expiresIn: EXPIRATION });
  },

  authenticate: (Model, user, data) => {
    return Model.authenticate.reduce((isValid, column) => {
      if (!isValid) return isValid;
      if (Model.encrypt.includes(column)) {
        return bcrypt.compareSync(data[column], user[column]);
      }

      return data[column] === user[column];
    }, true);
  },

  getUser: (Model, data) => {
    const authColumn = Model.authenticate.filter(
      column => !Model.encrypt.includes(column)
    )[0];

    return Model.database.where(authColumn, data[authColumn]);
  },

  onSuccess: ({ user, token }) => {
    return { auth: true, token };
  },

  onFail: ({ user, errors }) => {
    return { auth: false, token: null, message: errors };
  },

  response: ({ user, type, token, errors }) => {
    if (type === 'success') {
      return JWT.onSuccess({ user, token });
    }

    if (type === 'fail') {
      return JWT.onFail({ user, errors });
    }
  },

  register: (App, Model, prefix) =>
    App.post(`${prefix}/register`, (req, res) => {
      const data = getDataFromBody(Model.columns, req.body);

      const errors = Model.validate(data);
      if (Object.keys(errors).length !== 0) {
        return res
          .status(500)
          .send(JWT.response({ type: 'fail', Model, errors }));
      }

      const user = Model.create(data);
      const token = JWT.sign({ id: user.id, created_at: user.created_at });

      res.send(JWT.response({ type: 'success', user, token }));
    }),

  login: (App, Model, prefix) =>
    App.post(`${prefix}/login`, (req, res) => {
      const data = Model.mutate(getDataFromBody(Model.authenticate, req.body));

      const user = JWT.getUser(Model, data);
      if (!user)
        return res
          .status(401)
          .send(JWT.response({ type: 'fail', user, errors: `User not found` }));

      const isValid = JWT.authenticate(Model, user, data);
      if (!isValid)
        return res
          .status(401)
          .send(JWT.response({ user, type: 'fail', errors: `Not authorized` }));

      const token = JWT.sign({ id: user.id, created_at: user.created_at });
      res.send(JWT.response({ type: 'success', user, token }));
    }),

  logout: (App, Model, prefix) =>
    App.post(`${prefix}/logout`, (req, res) => {
      res.send(JWT.response({ user: {}, token: null, auth: false }));
    })
};

module.exports = JWT;
