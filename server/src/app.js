const express = require('express');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors');
const enableDestroy = require('server-destroy');

const stubs = require('./stubs/routing');
const scenarios = require('./scenarios/routing');
const cruds = require('./cruds/routing');
const proxy = require('./proxy/routing');
const unmatched = require('./unmatched/routing');
const { generateContracts } = require('./contracts/contractGeneration');

const { log } = require('./logger');

const app = express();

let server = null;

app.use(bodyParser.json());
app.use(xmlparser());
app.use(cors());

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

function start(port) {
  server = app.listen(port);
  enableDestroy(server);
  return server.address().port;
}

function stop() {
  server.destroy();
}

module.exports = { start, stop, app };
