const bcrypt = require('bcryptjs');
const Config = require('../config');
const pluralize = require('pluralize');
const Database = require('../database');
const Validate = require('./ValidateSchema');
const check = require('../helpers/typeCheck');

class Model {
  constructor(ModelSchema) {
    this.name = '';
    this.route = '';
    this.columns = [];
    this.factory = () => ({});
    this.attributeRoutes = false;
    this.protected = [];
    this.middlewares = [];
    this.encrypt = [];
    this.authenticate = [];
    this.hasOne = {};
    this.hasMany = {};
    this.mutations = {};
    this.validation = {};
    this.eagerLoad = [];

    this.hydrate(ModelSchema);
    Database.create(pluralize(this.name.toLowerCase()));
  }

  database() {
    return Database.select(pluralize(this.name.toLowerCase()));
  }

  hydrate(ModelSchema) {
    this.name = Validate.name(ModelSchema.name);
    this.route = Validate.route(ModelSchema.route);
    this.columns = Validate.columns(ModelSchema.columns);
    Object.keys(ModelSchema).forEach(property => {
      if (check.isSet(Validate[property])) {
        this[property] = Validate[property](ModelSchema[property]);
      }
    });
  }

  validate(data) {
    return Object.keys(this.validation).reduce((errors, column) => {
      const rule = this.validation[column];
      if (!rule.check(data[column])) {
        return { ...errors, [column]: rule.message(column) };
      }
      return errors;
    }, {});
  }

  hideProtected(row) {
    return Object.keys(row).reduce((protectedRow, column) => {
      if (!this.protected.includes(column)) {
        return { ...protectedRow, [column]: row[column] };
      }
      return protectedRow;
    }, {});
  }

  loadRelationship(model_id, relationship) {
    const eagerLoad = check.isObject(relationship)
      ? relationship
      : {
          model: relationship,
        };
    let relationshipModel;
    if (this.hasOne[relationship.model]) {
      relationshipModel = Config.get('models')[relationship.model];
      return relationshipModel.database().where(this.hasOne[relationship.model], model_id);
    }
    if (this.hasMany[relationship.model]) {
      relationshipModel = Config.get('models')[relationship.model];
      return relationshipModel.database().whereAll(this.hasMany[relationship.model], model_id) || [];
    }
  }

  getRelationships(row) {
    if (this.eagerLoad.length > 0) {
      this.eagerLoad.forEach(relationship => {
        const relationshipData = this.loadRelationship(row.id, relationship);
        if (relationshipData) {
          row[relationship.model.toLowerCase()] = relationshipData;
        }
      });
    }
    return row;
  }

  mutate(data) {
    return Object.keys(data).reduce((mutated, column) => {
      let value = data[column];
      if (this.mutations[column]) {
        value = this.mutations[column](data[column]);
      }
      return { ...mutated, [column]: value };
    }, {});
  }

  encryptColumns(data) {
    return Object.keys(data).reduce((encrypted, column) => {
      let value = data[column];
      if (this.encrypt.includes(column)) {
        value = bcrypt.hashSync(data[column], 8);
      }
      return { ...encrypted, [column]: value };
    }, {});
  }

  prepare(data) {
    return this.encryptColumns(this.mutate(data));
  }

  return(data) {
    return this.getRelationships(this.hideProtected(data));
  }

  all() {
    return this.database().all().map(row => this.return(row));
  }

  create(data) {
    const modelData = this.prepare(data);
    const row = this.database().create(modelData);
    return this.return(row);
  }

  find(id) {
    const row = this.database().select(id);
    return row ? this.return(row) : row;
  }

  update(id, data) {
    const modelData = this.prepare(data);
    const row = this.database().update(id, data);
    return row ? this.return(row) : row;
  }

  delete(id) {
    const wasDeleted = this.database().delete(id);
    return wasDeleted;
  }
}

module.exports = Model;
