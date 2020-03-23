const enableDestroy = require('server-destroy');
let runPort = 0;
let server;

function startup(maybeConfig) {
  const { listeningPort, logLevel } = getProvidedConfig(maybeConfig);

  const config = require('./config');
  config.logging.baseLevel = logLevel;

  const app = require('./app');

  server = app.listen(listeningPort, () => {});
  runPort = server.address().port;
  enableDestroy(server);
  return { listeningPort: runPort };
}

function getProvidedConfig(maybeConfig) {
  if (maybeConfig === undefined) {
    return {
      listeningPort: 0,
      logLevel: 'off'
    };
  }

  return {
    listeningPort: maybeConfig.port === undefined ? 0 : port,
    logLevel: maybeConfig.logLevel === undefined ? 'off' : maybeConfig.logLevel
  };
}

function shutdown() {
  server.destroy();
}

function clearAll() {
  const stubs = require('./stubs/Stubs');
  stubs.clear();

  const cruds = require('./cruds/Cruds');
  cruds.clear();

  const scenarios = require('./scenarios/Scenarios');
  scenarios.clear();

  const proxy = require('./proxy/Proxys');
  proxy.clear();
}

function listeningPort() {
  return runPort;
}

module.exports = {
  startup,
  shutdown,
  listeningPort,
  clearAll
};
