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
    this.relationshipRoutes = false;
    this.protected = [];
    this.middlewares = [];
    this.encrypt = [];
    this.authenticate = [];
    this.hasOne = {};
    this.hasMany = {};
    this.belongsTo = {};
    this.mutations = {};
    this.validation = {};
    this.eagerLoad = [];

    this.hydrate(ModelSchema);
    this.database = Database.create(pluralize(this.name.toLowerCase()));
  }

  hydrate(ModelSchema) {
    this.name = Validate.name(ModelSchema.name);
    this.route = this.generateRoute(Validate.route(ModelSchema.route));
    this.columns = Validate.columns(ModelSchema.columns);
    Object.keys(ModelSchema).forEach(property => {
      if (
        !['name', 'route', 'columns'].includes(property) &&
        check.isSet(Validate[property])
      ) {
        this[property] = Validate[property](ModelSchema[property]);
      }
    });
  }

  generateRoute(route) {
    const prefix = Config.get('api.prefix')
      .replace(/  +/g, '-')
      .replace(/^\/|\/$/g, '')
      .toLowerCase();
    const uri = route
      .replace(/  +/g, '-')
      .replace(/^\/|\/$/g, '')
      .toLowerCase();
    return `/${prefix}/${uri}`.replace(/\/\//g, '/');
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

  loadRelationship(model, relationship) {
    const eagerLoad = check.isObject(relationship)
      ? relationship
      : { model: relationship };

    let relationshipModel;
    if (this.hasOne[eagerLoad.model]) {
      relationshipModel = Config.get('models')[eagerLoad.model];
      const modelData = relationshipModel.database.where(
        this.hasOne[eagerLoad.model],
        model.id
      );
      return modelData ? relationshipModel.hideProtected(modelData) : null;
    }
    if (this.hasMany[eagerLoad.model]) {
      relationshipModel = Config.get('models')[eagerLoad.model];
      const modelData = relationshipModel.database.whereAll(
        this.hasMany[eagerLoad.model],
        model.id
      );
      return modelData ? modelData.map(row => relationshipModel.hideProtected(row)) : []
    }
    if (this.belongsTo[eagerLoad.model]) {
      relationshipModel = Config.get('models')[eagerLoad.model];
      const modelData = relationshipModel.database.where(
        'id',
        model[this.belongsTo[eagerLoad.model]]
      );
      return modelData ? relationshipModel.hideProtected(modelData) : null;
    }
  }

  getRelationships(row) {
    if (this.eagerLoad.length > 0) {
      this.eagerLoad.forEach(relationship => {
        const relationshipData = this.loadRelationship(row, relationship);
        if (relationshipData) {
          row[
            relationship.model
              ? relationship.model.toLowerCase()
              : relationship.toLowerCase()
          ] = relationshipData;
        }
      });
    }
    return row;
  }

  mutate(data) {
    return Object.keys(data).reduce((mutated, column) => {
      let value = data[column];
      if (this.mutations[column]) {
        value = this.mutations[column](data[column], Config);
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
    return this.database.all().map(row => this.return(row));
  }

  create(data) {
    const modelData = this.prepare(data);
    const row = this.database.create(modelData);
    return this.return(row);
  }

  find(id) {
    const row = this.database.select(id);
    return row ? this.return(row) : row;
  }

  update(id, data) {
    const modelData = this.prepare(data);
    const row = this.database.update(id, data);
    return row ? this.return(row) : row;
  }

  delete(id) {
    const wasDeleted = this.database.delete(id);
    return wasDeleted;
  }
}

module.exports = Model;
