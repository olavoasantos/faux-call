const Module = require('../modules/Module');

class Auth extends Module {
  route(to) {
    return `/${this.namespace
      .toLowerCase()
      .replace(/^\/?|\/?$/, '')}/${to
      .toLowerCase()
      .replace(/^\/?|\/?$/g, '')}/`;
  }

  sign() {}

  validate() {}

  registerHandler() {}

  loginHandler() {}

  logoutHandler() {}
}

module.exports = Auth;
