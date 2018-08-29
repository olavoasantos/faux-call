const modules = require('./base.modules');

module.exports = {
  get: name => modules[name],
  use: (name, moduleClass) => modules[name] = moduleClass,
  $$init: () => Object.keys(modules).forEach(name => modules[name].$$init()),
};
