const Config = require('../config');
const check = require('../helpers/typeCheck');

const models = Config.get('models');
const seeds = Config.get('seed');

const Seeder = {
  persist: (modelName) => {
    const model = models[modelName];
    let data = model.factory.create(seeds[modelName]);
    data = check.isArray(data) ? data : [data];
    data.forEach(row => model.create(row));
  },
  seed: () => {
    Object.keys(seeds).forEach(Seeder.persist);
  },
};

module.exports = Seeder;
