const pluralize = require('pluralize');
const Database = require('../database');
const check = require('../helpers/typeCheck');
const Validate = require('./ValidateSchema')();

class Model {
  constructor(ModelSchema) {
    this.name = '';
    this.route = '';
    this.columns = [];
    this.factory = () => ({});
    this.attributeRoutes = false;
    this.protected = [];
    this.middlewares = [];
    this.encrypt = [];
    this.authenticate = [];
    this.hasOne = {};
    this.hasMany = {};
    this.mutations = {};
    this.validation = {};

    this.hydrate(ModelSchema);
    this.database = Database.create(pluralize(this.name.toLowerCase()));
  }

  hydrate(ModelSchema) {
    this.name = Validate.name(ModelSchema.name);
    this.route = Validate.route(ModelSchema.route);
    this.columns = Validate.columns(ModelSchema.columns);
    Object.keys(ModelSchema).forEach(property => {
      if (check.isSet(Validate[property])) {
        this[property] = Validate[property](ModelSchema[property]);
      }
    });
  }
}

console.log(new Model({
  // Name of the model (is required)
  name: 'User',
  // Model's route base (is required)
  route: '/users',
  // Database columns (is required)
  columns: ['name', 'email', 'password'],
  // Protected attributes
  protected: ['password'],
  hasMany: {
    Education: 'user',
  },
  // Factory
  factory: faker => {
    return {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.random.word(),
    };
  },
  // Seeds
  seed: 2,
  // middlewares
  middlewares: ['auth'],
  // Use for auth
  authenticate: ['email', 'password'],
  // Encrypted fields
  encrypt: ['password'],
  // Mutate data before persisting it to the database
  mutations: {
    email: (value) => {
      // do something with the email before storing it.
      return value + '@'
    },
  },
  validation: {
    name: {
      message: () => 'Name is required',
      check: (value, data, databases) => {
        return !!value;
      },
    },
    email: {
      message: () => 'Invalid e-mail',
      check: (value, data, databases) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
      }
    }
  }
}));

// module.exports = Model;
