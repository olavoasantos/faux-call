const modules = require('./modules');

modules.get('test').extend(module => {
  module.routes = {
    route1: '/test',
  };
});

modules.$$init();

console.log(modules.get('test'));
