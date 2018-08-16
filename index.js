const chalk = require('chalk');
const project = require('./package.json');
const { App, Routes, Generator } = require('./Generator');

/** Base faux wrapper */
const faux = {
  generate: Generator,
  start: (port) => {
    App.listen(port, () => {
      console.log(`\n${project.name} - v${project.version} - by ${project.author.name} (${project.author.email})\n`);

      console.log('Routes:\n');
      Object.keys(Routes.all()).forEach(model => console.log(`${chalk.bgBlue.bold(`  ${model}  `)}  http://localhost:${port}/${Routes.get(model).base}\n`))
    });
  }
}

module.exports = faux;
