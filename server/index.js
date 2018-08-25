const setupCors = require('./cors');
const server = require('./instance');
const setupPlugins = require('./plugins');

// Server instance init
const app = server();

// Server setup
setupCors(app);
setupPlugins(app);

module.exports = app;
