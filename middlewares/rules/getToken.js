const jwt = require('jsonwebtoken');
const Config = require('../../config');
const Modules = require('../../modules');

module.exports = (req, res, next) => {
  const token = req.headers[Config.get('token.header')] || req.headers[Config.get('token.header').toLowerCase()];
  if (token) {
    jwt.verify(Modules.get('auth').parseToken(token), Config.get('secret'), (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      req.token = decoded;
      next();
    });
  } else {
    next();
  }
};
