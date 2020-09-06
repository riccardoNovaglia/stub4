const express = require('express');
const path = require('path');
const enableDestroy = require('server-destroy');

const config = require('./config');

const ui = express();

const clientFiles = path.resolve(__dirname, '../dist');
let server = null;

function start(port, stubsPort = config.stubsPort) {
  ui.get('/stubs-port', (_, res) => {
    res.send({ port: stubsPort });
  });

  ui.use(express.static(clientFiles));
  ui.use(express.static(`${clientFiles}/stub4`));

  ui.get('*', (_, res) => res.redirect(301, '/stub4'));

  server = ui.listen(port);
  enableDestroy(server);
  return server.address().port;
}

function stop() {
  server && server.destroy();
}

module.exports = { start, stop };
