const jsLoader = require('./loading/jsLoader');
const app = require('./app');
const uiServer = require('./ui');

let logger = null;
let theStubsPort = null;

function startup({ port = 0, logLevel = 'off' } = { port: 0, logLevel: 'off' }) {
  const config = require('./config');
  config.logging.baseLevel = logLevel;
  const { createLogger } = require('./logger');
  logger = createLogger('stub4');

  theStubsPort = app.start(port);
  logger.info(`Stub4 started on port ${theStubsPort}`);

  return { port: theStubsPort };
}

function startUi({ port = 0, stubsPort = theStubsPort } = { port: 0, stubsPort: theStubsPort }) {
  if (theStubsPort === null) {
    throw (
      "You're going to need to start the stubs server before you start the UI.\n" +
      'You should first run `stub4.startup()`'
    );
  }
  const uiPort = uiServer.start(port, stubsPort);
  logger.info(`UI started on ${uiPort} - http://localhost:${uiPort}`);
  logger.debug(`UI will speak with stubs at port ${stubsPort}`);
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

function stubsPort() {
  if (theStubsPort === null) {
    const x = 'const stub4Host = () => `http://localhost:${stub4.port()}`;';
    throw `Stub4 has not started yet, you can't get its port!
(this line doesn't get printed in some versions of jest, just ignore it.....)
If you're trying to setup its port in tests, you might need to put your assignment in a "before" or right in your test.
Another option is to make the assignment into a function:
${x}`;
  }
  return theStubsPort;
}

function addItems(items) {
  jsLoader.add(items);
}

module.exports = {
  startup,
  startUi,
  shutdown,
  addItems,
  clearAll,
  stubsPort
};
