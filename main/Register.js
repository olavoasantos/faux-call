const Config = require('../config');
const Model = require('../model/Model');

const Register = ModelSchema => {
  const model = new Model(ModelSchema);
  Config.assign('models', model.name, model);
  if (ModelSchema.seed && ModelSchema.seed > 0) {
    Config.assign('seed', model.name, ModelSchema.seed);
  }
};

module.exports = Register;
