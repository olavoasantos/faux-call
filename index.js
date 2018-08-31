const { Start, Register, App, Config } = require('./main');

/** Base faux wrapper */
const faux = {
  config: Config,
  register: Register,
  start: Start,
  route: App,
}

module.exports = faux;
