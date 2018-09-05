const { Start, Register, App, Config, Modules } = require('./main');

/** Base faux wrapper */
const faux = {
  config: Config,
  register: Register,
  modules: Modules,
  start: Start,
  route: App,
}

module.exports = faux;
