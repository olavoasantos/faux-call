# Faux call

Simple mock server for your convenience and testing!

## Usage

```js
// Import Faux
const { faux, Generator } = require('faux-call');

// Import Models
const UserModel = require('./path/to/UserModel');

// Generate API
Generator(UserModel);

// Start faux
faux.listen(3000, () => console.log('http://localhost:3000'));
```

## Model example

```js
// ./path/to/UserModel.js
const { factory, manager } = require('node-factory');

// User model factory definition
manager.register('User', faker => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
  };
});

const UserModel = {
  // Name of the model (is required)
  name: 'User',
  // Model's route base (is required)
  route: '/users',
  // Database columns (is required)
  columns: ['name', 'email'],
  // Model factory
  factory: factory('User'),
  // Number of seed to create
  seed: 50,
  // Model data validation
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
};

module.exports = UserModel;
```
