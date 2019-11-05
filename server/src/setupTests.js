const { createLogger } = require('./logger');
const logger = createLogger('tests');
beforeEach(() => {
  logger.silly('----- start -----');
});

afterEach(() => {
  logger.silly('----- end -----');
});
