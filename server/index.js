// External dependencies
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Init body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

module.exports = app;