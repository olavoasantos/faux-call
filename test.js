const { factory, manager } = require('node-factory');

// User model factory definition
manager.register('User', faker => {
  const pass = faker.random.uuid();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: pass.replace(/-/g, ''),
  };
});

const UserModel = {
  // Name of the model (is required)
  name: 'User',
  // Model's route base (is required)
  route: '/users',
  // Database columns (is required)
  columns: ['name', 'email', 'password'],
  factory: factory('User'),
  seed: 5,
  attributeRoutes: true,
  ignoreAttribute: ['password'],
};

// Import Faux
const faux = require('./index');

// Generate API (e.g. /users)
faux.generate(UserModel);

// Start faux
faux.start(3000);
