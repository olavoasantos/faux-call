const { Config, Start, Register, App } = require('./Faux');

/** Base faux wrapper */
const faux = {
  config: Config,
  register: Register,
  start: Start,
  route: App,
}

module.exports = faux;
