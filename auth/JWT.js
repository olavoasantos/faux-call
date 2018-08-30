const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Auth = require('./Auth');
const Config = require('../config');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');



class JWT extends Auth {
  init(self) {
    self.secret = Config.get('auth.secret');
    self.tokenHeader = Config.get('auth.header');
    self.namespace = Config.get('auth.namespace');
    self.expiration = Config.get('auth.expiration');
  }

  validate(req, res, next) {
    const token =
      req.headers[this.tokenHeader] ||
      req.headers[this.tokenHeader.toLowerCase()];
    if (!token)
      return res
        .status(403)
        .send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, this.secret, (err, user) => {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: 'Failed to authenticate token.' });

      const check = Config.get('auth.model').database().select(user.id);
      console.log('AUTH.MODEL', Config.get('auth.model'));
      console.log('CHECK', check);

      if (!check || check.created_at !== user.created_at)
        return res.status(500).send({ auth: false, message: 'Unauthorized.' });

      next();
    });
  }

  sign(user) {
    return jwt.sign(
      {
        id: registered.id,
        created_at: registered.created_at
      },
      this.secret,
      { expiresIn: this.expiration }
    );
  }

  registerHandler(req, res) {
    // Create new user
    const data = getDataFromBody(this.model.columns, req.body);
    this.model.validate(data);
    if (Object.keys(errors).length !== 0) {
      return res.status(500).send(errors);
    }
    const user = this.model.create(data);

    // Sign user
    const token = this.sign(user);
    res.send({ auth: true, token });
  }

  loginHandler(req, res) {
    // Get user
    let data = getDataFromBody(this.model.authenticate, req.body);
    data = this.model.mutate(data);
    const columns = this.model.authenticate.filter(
      column => !this.model.encrypt.includes(column)
    );
    if (columns.length === 0)
      return res
        .status(503)
        .send({ auth: false, token: null, message: 'Internal error' });

    const user = this.model.database().where(column[0], data[column[0]]);
    if (!user)
      return res
        .status(401)
        .send({ auth: false, token: null, message: 'User not found' });

    this.model.authenticate.forEach(column => {
      let isValid;
      if (this.model.encrypt.includes(column)) {
        isValid = bcrypt.compareSync(data[column], user[column]);
      } else {
        checkField = data[column] === user[column];
      }
      if (!isValid)
        return res.status(401).send({ message: `Invalid credentials` });
    });

    // Sign user
    const token = this.sign(user);
    res.send({ auth: true, token });
  }
}

module.exports = JWT;
