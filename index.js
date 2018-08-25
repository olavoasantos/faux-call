const { Config, Start, Register } = require('./Faux');

/** Base faux wrapper */
const faux = {
  config: Config,
  register: Register,
  start: Start,
}

module.exports = faux;
