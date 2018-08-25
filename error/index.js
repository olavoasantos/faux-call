const chalk = require('chalk');

module.exports = (message) => {
  console.log()
  console.log(`${chalk.bgRed(' Faux-Call Error ')}  ${chalk.red(message)}`);
  console.log()
  process.exit();
};
