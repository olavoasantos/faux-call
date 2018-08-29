const chalk = require('chalk');
const App = require('../server');
const { Routes } = require('../routes');
const Seeder = require('./Seeder');
const Config = require('../config');
const { generate } = require('../generators');
const project = require('../package.json');
const Modules = require('../modules');

const Start = port => {
  Modules.$$init();
  Seeder.seed();
  const models = Config.get('models');
  Object.keys(models).forEach(name => generate(models[name]));
  App.listen(port, () => {
    console.log(
      `\n${project.name} - v${project.version} - by ${project.author.name} (${
        project.author.email
      })\n`,
    );

    console.log('Routes:\n');
    Object.keys(Routes.all()).forEach(model =>
      console.log(
        `${chalk.bgBlue.bold(`  ${model}  `)}  http://localhost:${port}${
          Routes.get(model).base
        }\n`,
      ),
    );
  });
};

module.exports = Start;
