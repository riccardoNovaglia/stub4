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
const interactions = require('./interactions/routing');
const contracts = require('./contracts/routing');

const app = express();

let server = null;

app.use(bodyParser.json());
app.use(xmlparser());
app.use(cors());

// maybe these should go under /stub4, or /_stub4, something specific
app.use('/stubs', stubs.router);
app.use('/scenarios', scenarios.router);
app.use('/cruds', cruds.router);
app.use('/proxy', proxy.router);
app.use(unmatched.router);
app.use(interactions.router);
app.use(contracts.router);

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
