# Faux call

Simple mock server for your convenience and testing!

## How it works

Faux creates a VERY simple mocked database which is thrown out once the server is shut down.

## Install

```bash
yarn add -D faux-call
// or
npm install --save-dev faux-call
```

## Usage

```js
// Import Faux
const faux = require('faux-call');

// Import Models
const UserModel = require('./path/to/UserModel');

// Generate API
faux.generate(UserModel);

// Start faux
faux.start(3000);
```

## Accepted routes

- **GET => /route**: Get all rows from database
- **POST => /route**: Stores a new row on the database
- **GET => /route/:id**: Gets the row with a specific id
- **PUT|PATCH => /route/:id**: Updates a row with a specific id
- **DELETE => /route/:id**: Deletes a row with a specific id

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
