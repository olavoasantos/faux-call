const chalk = require('chalk');
const project = require('./package.json');
const { App, Routes, Generators, Config, Database } = require('./Faux');

const seed = () => {
  const Factories = Config.get('factories');
  Object.keys(Factories).forEach(name => {
    const {factory, seed, Model} = Factories[name];
    if (!seed) return;
    let list = factory.create(seed);
    list = Array.isArray(list) ? list : [list];
    list.forEach($data => {
      const data = Database.select(Model.name.toLocaleLowerCase()).create($data);
      let relationshipData;
      if (Model.hasMany) {
        Object.keys(Model.hasMany).forEach(relationship => {
          if (Object.keys(Factories).includes(relationship)) {
            relationshipData = Factories[relationship].factory.create({ [Model.hasMany[relationship]]: data.id }, Math.floor(Math.random() * 6) + 1);
            if (!Array.isArray(relationshipData)) relationshipData = [relationshipData];
            relationshipData.map($rel => Database.select(relationship.toLocaleLowerCase()).create($rel));
          }
        });
      }
      if (Model.hasOne) {
        Object.keys(Model.hasOne).forEach(relationship => {
          if (Object.keys(Factories).includes(relationship)) {
            relationshipData = Factories[relationship].factory.create({ [Model.hasMany[relationship]]: data.id });
            Database.select(relationship.toLocaleLowerCase()).create(relationshipData);
          }
        });
      }
    });
  });
};

/** Base faux wrapper */
const faux = {
  config: Config,
  generate: Generators.generate,
  start: (port) => {
    seed();
    App.listen(port, () => {
      console.log(`\n${project.name} - v${project.version} - by ${project.author.name} (${project.author.email})\n`);

      console.log('Routes:\n');
      Object.keys(Routes.all()).forEach(model => console.log(`${chalk.bgBlue.bold(`  ${model}  `)}  http://localhost:${port}/${Routes.get(model).base}\n`))
    });
  }
}

module.exports = faux;
