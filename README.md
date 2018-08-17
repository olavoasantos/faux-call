# Faux call

Simple mock server for your convenience and testing!

## Still a work in progress

This is still under development, which means that the API and functionality might change drastically.

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

If you wish to ignore certain attributes (such as passwords), you can declare a `protected` array containing the ignored column names.

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
const UserModel = {
  // Name of the model (is required)
  // String
  name: 'User',
  // Model's route base (is required)
  // String
  route: '/users',
  // Database columns (is required)
  // Array [(Column)<Strings>]
  columns: ['name', 'email', 'password'],

  /** --- OPTIONAL PROPS --- */
  // Model factory
  // Function(Faker.js) => Object {(Column): <String|Number|Bool>}
  // https://github.com/Marak/Faker.js#api-methods
  factory: faker => {
    return {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.random.word(),
    };
  },
  // Number of seed to create
  // Number > 0
  seed: 50,
  // Generate attribute routes (e.g. /users/1/email)
  // Bool
  attributeRoutes: true,
  // Protect attributes (dont send it nor create attribute routes)
  // Array [(Column)<Strings>]
  protected: ['password'],
  // Protect your routes with middlewares
  // Array [(middleware)<Strings>]
  middlewares: ['auth'],
  // Use for auth
  // Array [(Column)<Strings>]
  authenticate: ['email', 'password'],
  // Encrypted fields
  // Array [<Strings>]
  encrypt: ['password'],
  // Mutate data before persisting it to the database
  // Object { (Column): <Functions> }
  mutations: {
    email: (value) => {
      // do something with the email before storing it.
    },
  }
  // Model data validation
  // Object { (Column): <Object { message: <Function>, check: <Function> }> }
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

## Version log

- **v0.1.1**: Small fixes

- **v0.1.0**: Using protection

  - Major refactor of code base
  - Added auto generation of atribute routes
  - Added attribute protection
  - Added middlewares (only auth for now)
  - Added JWT authentication
  - Added auth routes (register/login/logout) based on model schema
  - Added attribute encryption using bcrypt
  - Added attribute mutation
  - Changed factory declaration
  - Changed `ignoreAttribute` key to `protected`

- **v0.0.2**: Bug fixes

- **v0.0.1**: Hello world!

  - Create CRUD based on model schema
  - Seed database using node-factory

## Author

- [Olavo Amorim Santos]
