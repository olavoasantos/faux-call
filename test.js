const UserModel = {
  // Name of the model (is required)
  name: 'User',
  // Model's route base (is required)
  route: '/users',
  // Database columns (is required)
  columns: ['name', 'email', 'password'],
  // Protected attributes
  protected: ['password'],
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
  }
};

// Import Faux
const faux = require('./index');

// Generate API (e.g. /users)
faux.generate(UserModel);

// Start faux
faux.start(3000);
