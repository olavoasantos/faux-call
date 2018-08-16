const { factory, manager } = require('node-factory');

// User model factory definition
manager.register('Profile', faker => {
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    user_id: faker.random.number(),
  };
});

manager.register('User', faker => {
  const pass = faker.random.uuid();
  return {
    password: pass.replace(/-/g, ''),
    profile: factory('Profile').create(),
  };
});

const UserModel = {
  // Name of the model (is required)
  name: 'User',
  // Model's route base (is required)
  route: '/users',
  // Database columns (is required)
  columns: ['password'],
  factory: factory('User'),
  seed: 5,
};
const ProfileModel = {
  // Name of the model (is required)
  name: 'Profile',
  // Model's route base (is required)
  route: '/profiles',
  // Database columns (is required)
  columns: ['name', 'email', 'user_id'],
  factory: factory('Profile'),
};

// Import Faux
const faux = require('./index');

// Generate API (e.g. /users)
faux.generate(UserModel);
faux.generate(ProfileModel);

// Start faux
faux.start(3000);
