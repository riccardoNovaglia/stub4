const enableDestroy = require('server-destroy');
const jsLoader = require('./loading/jsLoader');
let runPort = 0;
let server;

function startup(maybeConfig) {
  const { listeningPort, logLevel } = getProvidedConfig(maybeConfig);

  const config = require('./config');
  config.logging.baseLevel = logLevel;

  const app = require('./app');
  const { createLogger } = require('./logger');
  const logger = createLogger('stub4');

  server = app.listen(listeningPort, () => {
    logger.info(`Stub4 started on port ${runPort}`);
  });
  runPort = server.address().port;
  enableDestroy(server);
  return { listeningPort: runPort };
}

function getProvidedConfig(maybeConfig = {}) {
  const port = maybeConfig.port ? maybeConfig.port : 0;
  const logLevel = maybeConfig.logLevel ? maybeConfig.logLevel : 'off';

  return {
    listeningPort: port,
    logLevel: logLevel
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
  if (!server) {
    const x = 'const stub4Host = () => `http://localhost:${stub4.listeningPort()}`;';
    throw `Stub4 has not started yet, you can't get its port!
(this line doesn't get printed in some versions of jest, just ignore it.....)
If you're trying to setup its port in tests, you might need to put your assignment in a "before" or right in your test.
Another option is to make the assignment into a function:
${x}`;
  }
  return server.address().port;
}

function addItems(items) {
  jsLoader.add(items);
}

module.exports = {
  startup,
  shutdown,
  addItems,
  clearAll,
  listeningPort
};
