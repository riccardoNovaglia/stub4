const { createLogger } = require('../logger');
const interactions = require('../interactions/interactions');

const logger = createLogger('cruds');

const cruds = require('./Cruds');
const { crudFromRequest } = require('./Crud');

const router = require('../router')({
  items: cruds,
  builderFn: crudFromRequest,
  names: { many: 'cruds', one: 'crud' }
});

function middleware(req, res, next) {
  try {
    logger.debug(`Trying to find crud for ${req.originalUrl} ${req.method}`);
    const crud = cruds.get(req.originalUrl);
    if (crud) {
      logger.debug(`Crud found matching request`);
      interactions.addInteraction({ ...crud.toJson(), type: 'cruds' });
      return crud.getResponse(req.originalUrl, req.method, req.body, res);
    } else {
      logger.debug('No crud found matching request. Continuing');
      return next();
    }
  } catch (e) {
    logger.error('An error occurred trying to respond from crud: ', e);
    return next();
  }
}

module.exports = { middleware, router };
