const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const stubs = require('./stubs');
const dbs = require('./dbs');
const { generateContracts } = require('./contracts/contractGeneration');

const log = require('./logger');

const app = express();
app.use(bodyParser.json());

function load(loadFile) {
  const contents = JSON.parse(fs.readFileSync(loadFile, { encoding: 'utf8' }).toString());

  dbs.load(contents.dbs);
}

app.use('/stubs', stubs.router);

app.use('/dbs', dbs.router);

app.post('/generate-pact', async (_, res) => {
  try {
    // should this publish too? or return them?
    await generateContracts();
  } catch (e) {
    log('whops', e);
  }
  res.end();
});

app.all('*', stubs.middleware, dbs.middleware);

module.exports = {
  app,
  load
};
