const jwt = require('jsonwebtoken');
const Config = require('../../config');
const Database = require('../../database');

module.exports = (req, res, next) => {
  const token = req.token;
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  const user = Config.get('authModel').return(Config.get('authModel').database.select(token.id));
  if (!user || user.created_at !== token.created_at) return res.status(500).send({ auth: false, message: 'Unauthorized.' });

  req.user = user;
  next();
};
