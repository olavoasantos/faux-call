const ProfileModel = {
  // Name of the model (is required)
  name: 'Education',
  // Model's route base (is required)
  route: '/educations',
  // Database columns (is required)
  columns: ['institution', 'course', 'conclusion', 'user'],
  seed: 2,
  factory: faker => ({
    'institution': faker.random.word(),
    'course': faker.random.word(),
    'conclusion': faker.random.boolean(),
    'user': 1,
  }),
}

const UserModel = {
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
  // middlewares: ['auth'],
  // Use for auth
  authenticate: ['email', 'password'],
  // Encrypted fields
  encrypt: ['password'],
  // Mutate data before persisting it to the database
  mutations: {
  }
};

// Import Faux
const faux = require('./index');

// set config
// faux.config.set('auth.namespace', '/auth');

// Generate API (e.g. /users)
faux.generate(UserModel);
faux.generate(ProfileModel);

// Start faux
faux.start(3000);
