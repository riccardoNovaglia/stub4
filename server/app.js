const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');

const getRequestMatcher = require('./stubs/request');
const extractResponse = require('./stubs/response');
const stubs = require('./stubs/stubbing');
const dbs = require('./dbs/stubbing');

const app = express();
app.use(bodyParser.json());

app.post('/new-stub', function(req, res) {
  try {
    const request = getRequestMatcher(req);
    const response = extractResponse(req);

    stubs.add(request, response);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/stubs', (_, res) => {
  res.json(stubs.all());
});

app.post('/clear-stubs', (_, res) => {
  stubs.clearAll();
  res.end();
});

app.post('/new-db', function(req, res) {
  const url = _.get(req.body, 'url');
  const idAlias = _.get(req.body, 'idAlias', 'id');
  dbs.addDb(url, idAlias);
  return res.end();
});

app.post('/clear-dbs', function(req, res) {
  dbs.clearAll();
  return res.end();
});

app.all('*', stubs.middleware, dbs.middleware);

module.exports = app;
