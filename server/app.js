const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const stubs = require('./stubs');
const dbs = require('./dbs');

const app = express();
app.use(bodyParser.json());

function load(loadFile) {
  const contents = JSON.parse(fs.readFileSync(loadFile, { encoding: 'utf8' }).toString());

  dbs.load(contents.dbs);
}

app.use('/stubs', stubs.router);

app.use('/dbs', dbs.router);

app.all('*', stubs.middleware, dbs.middleware);

module.exports = {
  app,
  load
};
