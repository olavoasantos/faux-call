const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const App = require('../server');
const Config = require('../config');
const Modules = require('../modules');
const Database = require('../database');
const { getDataFromBody } = require('../helpers');

const Auth = () => {
  const Model = Config.get('authModel');
  const AuthModule = Modules.get('auth');

  const namespace = `${Config.get('auth.namespace').toLowerCase().replace(/^\/?|\/?$/, '')}`;
  const prefix = namespace ? `/${namespace}` : namespace;

  AuthModule.register(App, Model, prefix);
  AuthModule.login(App, Model, prefix);
  AuthModule.logout(App, Model, prefix);
};

module.exports = Auth;