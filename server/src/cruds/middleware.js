const { createLogger } = require('../logger');
const { get } = require('./stubbing');

const logger = createLogger('cruds');

function middleware(req, res, next) {
  try {
    logger.debug(`Trying to find crud for ${req.originalUrl} ${req.method}`);
    const crud = get(req.originalUrl, req.method, req.body);
    if (crud) {
      logger.debug(`Crud found matching request. Returning json: ${JSON.stringify(crud)}`);
      return res.json(crud);
    } else {
      logger.debug('No crud found matching request. Continuing');
      return next();
    }
  } catch (e) {
    logger.error('The request is not a crud: ', e);
    return next();
  }
}

module.exports = middleware;
