const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');

const getRequestMatcher = require('./request');
const extractResponse = require('./response');
const addRoute = require('./routing');

const app = express();
app.use(bodyParser.json());

app.post('/new-stub', function(req, res) {
  try {
    const request = getRequestMatcher(req);
    const response = extractResponse(req);

    addRoute(app, request, response);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = app;
