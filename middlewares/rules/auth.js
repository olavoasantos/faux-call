const jwt = require('jsonwebtoken');
const config = require('../../config');
const Database = require('../../database');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    const check = Database.select(global.auth.name.toLowerCase()).select(decoded.id);
    if (!check || check.created_at !== decoded.created_at) return res.status(500).send({ auth: false, message: 'Unauthorized.' });

    next();
  });
};
