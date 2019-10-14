const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const stubs = require('./stubs');
const scenarios = require('./scenarios/routing');
const cruds = require('./cruds');
const proxy = require('./proxy');
const unmatched = require('./unmatched');
const { generateContracts } = require('./contracts/contractGeneration');

const log = require('./logger');

const app = express();
app.use(bodyParser.json());
app.use(cors());

function load(loadFile) {
  const contents = JSON.parse(fs.readFileSync(loadFile, { encoding: 'utf8' }).toString());

  cruds.load(contents.cruds);
  stubs.loadFromFile(contents.stubs);
  scenarios.loadFromFile(contents.scenarios);
}

app.use('/stubs', stubs.router);

app.use('/scenarios', scenarios.router);

app.use('/cruds', cruds.router);

app.use('/proxy', proxy.router);

app.use(unmatched.router);

app.post('/generate-pact', async (req, res) => {
  try {
    // should this publish too? or return them?
    await generateContracts({ consumer: req.body.consumer });
  } catch (e) {
    log('whops', e);
  }
  return res.end();
});

app.all(
  '*',
  stubs.middleware,
  scenarios.middleware,
  cruds.middleware,
  proxy.middleware,
  unmatched.middleware
);

module.exports = {
  app,
  load
};
