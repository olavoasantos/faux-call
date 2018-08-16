const chalk = require('chalk');
const project = require('./package.json');
const { app, routes, Generator } = require('./Generator');

/** Base faux wrapper */
const faux = {
  start: (port) => {
    app.listen(port, () => {
      console.log(`\n${project.name} - v${project.version} - by ${project.author.name} (${project.author.email})\n`);

      console.log('Routes:\n');
      Object.keys(routes).forEach(model => console.log(`- ${chalk.bgBlue.bold(`  ${model}  `)}  http://localhost:${port}/${routes[model]}\n`))
    });
  }
}

module.exports = { faux, Generator };
