const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const stubs = require('./stubs');
const cruds = require('./cruds');
const unmatched = require('./unmatched');
const { generateContracts } = require('./contracts/contractGeneration');

const log = require('./logger');

const app = express();
app.use(bodyParser.json());

function load(loadFile) {
  const contents = JSON.parse(fs.readFileSync(loadFile, { encoding: 'utf8' }).toString());

  cruds.load(contents.cruds);
}

app.use('/stubs', stubs.router);

app.use('/cruds', cruds.router);

app.use(unmatched.router);

app.post('/generate-pact', async (req, res) => {
  try {
    // should this publish too? or return them?
    await generateContracts({ consumer: req.body.consumer });
  } catch (e) {
    log('whops', e);
  }
  res.end();
});

app.all('*', stubs.middleware, cruds.middleware, unmatched.middleware);

module.exports = {
  app,
  load
};
