/**
 * @jest-environment node
 */
// The above is needed so that we can proxy requests to localhost in the proxy tests (https://github.com/axios/axios/issues/1754#issuecomment-435784235)

const { createLogger } = require('./logger');
const logger = createLogger('tests');
beforeEach(() => {
  logger.silly('----- start -----');
});

afterEach(() => {
  logger.silly('----- end -----');
});
