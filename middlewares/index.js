const middlewares = require('./middlewares');
module.exports = (name) => {
  if (!middlewares[name]) throw new Error(`Middleware ${name} does not exits`);

  return middlewares[name];
};
