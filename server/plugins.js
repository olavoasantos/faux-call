const bodyParser = require('./plugins/bodyParser');
const installers = [
  bodyParser,
];

module.exports = (app) => {
  installers.forEach(plugin => plugin(app));
};
