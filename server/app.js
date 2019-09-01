const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');

const stubs = require('./stubs');
const dbs = require('./dbs');

const app = express();
app.use(bodyParser.json());

app.use('/stubs', stubs.router);

app.use('/dbs', dbs.router);

app.all('*', stubs.middleware, dbs.middleware);

module.exports = app;
