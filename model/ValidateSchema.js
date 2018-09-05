const pluralize = require('pluralize');
const { manager, factory } = require('node-factory');

const error = require('../error');
const check = require('../helpers/typeCheck');
const middlewares = require('../middlewares/middlewares');

module.exports = (() => {
  let name = null;
  const columnList = [];

  return {
    eagerLoad: relationships => {
      if (!check.isArray(relationships)) {
        error(`The ${name} model eager load should be an array.`);
      }

      Object.keys(relationships).forEach(relationship => {
        if (
          !(
            check.isString(relationships[relationship]) ||
            check.isObject(relationships[relationship])
          )
        ) {
          error(
            `The ${name} model's eager load relationship ${relationship} should be either a string or an object.`,
          );
        }

        if (check.isObject(relationships[relationship])) {
          if (!check.isSet(relationships[relationship].model)) {
            error(
              `The ${name} model's eager load relationship ${relationship} object should contain contain a 'model' key.`,
            );
          }
          if (!check.isString(relationships[relationship].model)) {
            error(
              `The ${name} model's eager load relationship ${relationship} object 'model' should be a string.`,
            );
          }
        }
      });
      return relationships;
    },

    validation: rules => {
      if (!check.isObject(rules)) {
        error(`The ${name} model validation should be an object.`);
      }

      Object.keys(rules).forEach(rule => {
        if (!check.isObject(rules[rule])) {
          error(`The ${name} model's validation ${rule} should be an object.`);
        }

        if (!check.isSet(rules[rule].message)) {
          error(
            `The ${name} model's validation ${rule} should contain a message function.`,
          );
        }

        if (!check.isFunction(rules[rule].message)) {
          error(
            `The ${name} model's validation ${rule} message should be a function.`,
          );
        }

        if (!check.isString(rules[rule].message())) {
          error(
            `The ${name} model's validation ${rule} message should return a string.`,
          );
        }

        if (!check.isSet(rules[rule].check)) {
          error(
            `The ${name} model's validation ${rule} should contain a check function.`,
          );
        }

        if (!check.isFunction(rules[rule].check)) {
          error(
            `The ${name} model's validation ${rule} check should be a function.`,
          );
        }
      });

      return rules;
    },

    mutations: mutations => {
      if (!check.isObject(mutations)) {
        error(`The ${name} model mutations should be an object.`);
      }

      Object.keys(mutations).forEach(mutation => {
        if (!check.isFunction(mutations[mutation])) {
          error(
            `The ${name} model's mutations ${mutation} should be a function.`,
          );
        }
      });

      return mutations;
    },

    belongsTo: relationships => {
      if (!check.isObject(relationships)) {
        error(`The ${name} model belongsTo relationships should be an object.`);
      }

      Object.keys(relationships).forEach(relationship => {
        if (!check.isString(relationships[relationship])) {
          error(
            `The ${name} model's belongsTo relationship ${relationship} should be a string.`,
          );
        }
      });

      return relationships;
    },

    hasOne: relationships => {
      if (!check.isObject(relationships)) {
        error(`The ${name} model hasOne relationships should be an object.`);
      }

      Object.keys(relationships).forEach(relationship => {
        if (!check.isString(relationships[relationship])) {
          error(
            `The ${name} model's hasOne relationship ${relationship} should be a string.`,
          );
        }
      });

      return relationships;
    },

    hasMany: relationships => {
      if (!check.isObject(relationships)) {
        error(`The ${name} model hasMany relationships should be an object.`);
      }

      Object.keys(relationships).forEach(relationship => {
        if (!check.isString(relationships[relationship])) {
          error(
            `The ${name} model's hasMany relationship ${relationship} should be a string strings.`,
          );
        }
      });

      return relationships;
    },

    route: route => {
      if (!check.isSet(route)) {
        route = `/${pluralize(name.toLowerCase())}`;
      }

      if (!check.isString(route)) {
        error(`The ${name} model route should be a string.`);
      }

      return route;
    },

    attributeRoutes: attributeRoutes => {
      if (!check.isBool(attributeRoutes)) {
        error(`The ${name} model's attributeRoutes should be a boolean.`);
      }

      return attributeRoutes;
    },

    relationshipRoutes: relationshipRoutes => {
      if (!check.isBool(relationshipRoutes)) {
        error(`The ${name} model's relationshipRoutes should be a boolean.`);
      }

      return relationshipRoutes;
    },

    factory: modelFactory => {
      if (!check.isFunction(modelFactory)) {
        error(`The ${name} model's factory should be a function.`);
      }

      manager.register(name, modelFactory);
      if (!check.isObject(factory(name).create())) {
        error(`The ${name} model's factory should return an object.`);
      }

      return factory(name);
    },

    columns: columns => {
      if (!check.isSet(columns)) {
        error(`The ${name} model's columns are required.`);
      }

      if (!check.isArray(columns)) {
        error(`The ${name} model's columns should be an array.`);
      }

      columns.forEach(column => {
        if (!check.isString(column)) {
          error(`The ${name} model's columns should only contain strings.`);
        }

        if (!columnList.includes(column)) {
          columnList.push(column);
        }
      });

      return columns;
    },

    encrypt: columns => {
      if (!check.isArray(columns)) {
        error(`The ${name} model's encrypted columns should be an array.`);
      }

      columns.forEach(column => {
        if (!check.isString(column)) {
          error(
            `The ${name} model's encrypted columns should only contain strings.`,
          );
        }

        if (!columnList.includes(column)) {
          error(
            `The encrypted column '${column}' is not defined in the ${name} model.`,
          );
        }
      });

      return columns;
    },

    protected: columns => {
      if (!check.isArray(columns)) {
        error(`The ${name} model's protected columns should be an array.`);
      }

      columns.forEach(column => {
        if (!check.isString(column)) {
          error(
            `The ${name} model's protected columns should only contain strings.`,
          );
        }

        if (!columnList.includes(column)) {
          error(
            `The protected column '${column}' is not defined in the ${name} model.`,
          );
        }
      });

      return columns;
    },

    authenticate: columns => {
      if (!check.isArray(columns)) {
        error(`The ${name} model's authenticate should be an array.`);
      }

      columns.forEach(column => {
        if (!check.isString(column)) {
          error(
            `The ${name} model's authenticate should only contain strings.`,
          );
        }

        if (!columnList.includes(column)) {
          error(
            `The authenticate column '${column}' is not defined in the ${name} model.`,
          );
        }
      });

      return columns;
    },

    middlewares: middlewares => {
      if (!check.isArray(middlewares)) {
        error(`The ${name} model's middlewares should be an array.`);
      }

      middlewares.forEach(middleware => {
        if (!check.isString(middleware)) {
          error(`The ${name} model's middlewares should only contain strings.`);
        }

        if (!middlewares.includes(middleware)) {
          error(
            `The middleware '${middleware}' declared in the ${name} model is not defined.`,
          );
        }
      });

      return middlewares;
    },

    name: modelName => {
      if (!check.isSet(modelName)) {
        error('The model name is required.');
      }

      if (!check.isString(modelName)) {
        error('The model name should be a string.');
      }

      if (!/^[a-z]+$/i.test(modelName)) {
        error('The model name should only contain letters.');
      }

      name = modelName;

      return modelName;
    },
  };
})();
