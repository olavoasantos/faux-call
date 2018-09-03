# Faux call

Simple mock server for your convenience and testing!

## Disclaimer

This is still under development, which means that the API and functionality might change.

## How it works

Faux creates a VERY simple mocked database which is thrown out once the server is shut down.

## Install

```bash
yarn add -D faux-call
// or
npm install --save-dev faux-call
```

## Usage

Create a server file which will initialize Faux-call:

```js
// ./path/to/faux.server.js

// Import Faux
const faux = require('faux-call');

// Import Models
const UserModel = require('./path/to/UserModel');

// Register API
faux.register(UserModel);

// Set API namespace
// localhost:3000/api/users
faux.config.set('api.namespace', '/api');

// Set auth namespace
// localhost:3000/auth/login
// localhost:3000/auth/logout
// localhost:3000/auth/register
faux.config.set('auth.namespace', '/auth');

// Defining custom route
faux.route.get('/my/custom/route', (res, req) => {
  return res.send('my custom response');
});

// Start faux
faux.start(3000);
```

Once your configuration is ready, use node to run it:

```bash
node ./path/to/faux.server.js
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

## Relationship routes

If `relationshipRoutes` is activated on the model, Faux will generate route for you to view, add, modify and delete relationship data:

- **GET => /route/:id/relationship**: Lists all related rows
- **POST => /route/:id/relationship**: Adds a new row to the model
- **PATCH => /route/:id/relationship/:relationship_id**: Updates a related model
- **DELETE => /route/:id/relationship/:relationship_id**: Deletes a related model

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
  // Generate relationship routes (e.g. /users/1/profile)
  // Bool
  relationshipRoutes: true,
  // Protect attributes (dont send it nor create attribute routes)
  // Array [(Column)<Strings>]
  protected: ['password'],
  // Protect your routes with middlewares
  // Array [(middleware)<Strings>]
  middlewares: ['auth'],
  // Columns used for auth
  // Array [(Column)<Strings>]
  authenticate: ['email', 'password'],
  // Encrypted fields
  // Array [<Strings>]
  encrypt: ['password'],
  // Has one relationship with other models
  // { (Model name): column_name<String> }
  hasOne: {
    'Profile': 'user',
  },
  // Has many relationship with other models
  // { (Model name): column_name<String> }
  hasMany: {
    'Post': 'user',
  },
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

## Roadmap

- [All future features](https://github.com/olavoasantos/faux-call/issues?q=is:open+is:issue+label:todo)

Functionalities and features:

- [New features](https://github.com/olavoasantos/faux-call/issues?q=is:open+is:issue+label:feature)
- [Internal refactoring](https://github.com/olavoasantos/faux-call/issues?q=is:open+is:issue+label:refactor)

Project related (documentation, website, ...):

- [Project features](https://github.com/olavoasantos/faux-call/issues?q=is:open+is:issue+label:"project+feature")
- [Project refactoring](https://github.com/olavoasantos/faux-call/issues?q=is:open+is:issue+label:"project+refactor")

## Bugs

- [Bugs](https://github.com/olavoasantos/faux-call/issues?q=is:open+is:issue+label:bug)

## Version log

- **v0.2.x**:

  - [Added relationship routes](https://github.com/olavoasantos/faux-call/issues/8)
  - [Added custom route responses](https://github.com/olavoasantos/faux-call/issues/9)
  - [Added API route prefix](https://github.com/olavoasantos/faux-call/issues/6)
  - Bug fixes and internal refactoring

- **v0.1.x**:

  - Added relationships (hasOne, hasMany)
  - Added eager loading relationships
  - Added custom authentication prefix
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
  - Bug fixes and internal refactoring

- **v0.0.x**:

  - Initial commits
  - Create CRUD based on model schema
  - Seed database using node-factory

## Author

- [Olavo Amorim Santos](https://github.com/olavoasantos/)
