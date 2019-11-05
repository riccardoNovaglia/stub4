const { createLogger } = require('../../logger');
const unmatched = require('../unmatched');

const logger = createLogger('unmatched');

function middleware(req, _, next) {
  unmatched.addUnmatch(req.originalUrl, req.method);
  logger.info(
    `'${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}' didn't match any existing stub`
  );
  return next();
}

module.exports = middleware;
