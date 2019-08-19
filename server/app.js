const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');

const getRequestMatcher = require('./request');
const extractResponse = require('./response');
const stubs = require('./stubbing');

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

app.all('*', (req, res) => {
  const matchedStub = stubs.get(req);
  return res
    .set('Content-Type', matchedStub.response.contentType)
    .send(matchedStub.response.body);
});

module.exports = app;
