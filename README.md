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

## Attribute routes

If `attributeRoutes` is activated on the model, Faux will generate route attributes for you to get and patch data:

- **GET => /route/:id/:attribute**: Gets a specific attribute from a row with a specific id
- **PATCH => /route/:id/:attribute**: Updates a specific attribute from a row with a specific id

If you wish to ignore certain attributes (such as passwords), you can declare an `ignoreAttributes` array containing the column names.

## Mocking the not so happy path

When testing your application, there will be times where you need to test failed states and responses. On these cases, Faux allows you to mock the `status` and `response` messages. To do so, just add a `status` and a JSON `response` string header to your request. For instance:

```js
post('http://localhost:3000/users', data, {
    headers: {
      status: 500,
      response: '{"message": "E-mail field must be unique."}'
    }
});
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
  // Generate attribute routes (e.g. /users/1/email)
  attributeRoutes: true,
  // Ignore certain columns in attribute routes (e.g. /users/1/password)
  attributeRoutes: ['password'],
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
