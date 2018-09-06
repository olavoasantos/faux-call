const middlewares = require('./middlewares');
const globals = require('./globals');

module.exports = {
  get: (name) => {
    if (!middlewares[name]) throw new Error(`Middleware ${name} does not exits`);
    return middlewares[name];
  },
  globals,
};
