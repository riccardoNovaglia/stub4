const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');

const stubs = require('./stubs/stubbing');
const stubsRouter = require('./stubs/router');
const dbs = require('./dbs/stubbing');
const dbsRouter = require('./dbs/router');

const app = express();
app.use(bodyParser.json());

app.use('/stubs', stubsRouter);

app.use('/dbs', dbsRouter);

app.all('*', stubs.middleware, dbs.middleware);

module.exports = app;
