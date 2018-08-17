const jwt = require('jsonwebtoken');
const Config = require('../../config');
const Database = require('../../database');

module.exports = (req, res, next) => {
  const token = req.headers[Config.get('token.header')] || req.headers[Config.get('token.header').toLowerCase()];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, Config.get('secret'), (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    const check = Database.select(Config.get('authModel').name.toLowerCase()).select(decoded.id);
    if (!check || check.created_at !== decoded.created_at) return res.status(500).send({ auth: false, message: 'Unauthorized.' });

    next();
  });
};
