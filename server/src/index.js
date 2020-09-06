const jsLoader = require('./loading/jsLoader');
const app = require('./app');
const uiServer = require('./ui');
let stubsListeningPort = null;

function startup(maybeConfig) {
  const { listeningPort, logLevel, ui } = getProvidedConfig(maybeConfig);

  const config = require('./config');
  config.logging.baseLevel = logLevel;

  const { createLogger } = require('./logger');
  const logger = createLogger('stub4');

  stubsListeningPort = app.start(listeningPort);
  logger.info(`Stub4 started on port ${stubsListeningPort}`);

  if (ui) {
    const uiPort = uiServer.start(8081, stubsListeningPort);
    logger.info(`UI started on ${uiPort} - http://localhost:${uiPort}`);
  }

  return { listeningPort: stubsListeningPort };
}

function getProvidedConfig(maybeConfig = {}) {
  const port = maybeConfig.port ? maybeConfig.port : 0;
  const logLevel = maybeConfig.logLevel ? maybeConfig.logLevel : 'off';
  const ui = maybeConfig.ui ? maybeConfig.ui : false;

  return {
    listeningPort: port,
    logLevel,
    ui
  };
}

function shutdown() {
  app.stop();
  uiServer.stop();
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
  if (stubsListeningPort === null) {
    const x = 'const stub4Host = () => `http://localhost:${stub4.listeningPort()}`;';
    throw `Stub4 has not started yet, you can't get its port!
(this line doesn't get printed in some versions of jest, just ignore it.....)
If you're trying to setup its port in tests, you might need to put your assignment in a "before" or right in your test.
Another option is to make the assignment into a function:
${x}`;
  }
  return stubsListeningPort;
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
