const { createLogger } = require('../logger');
const interactions = require('../interactions/interactions');
const stubs = require('./Stubs');

const logger = createLogger('stubs');

const { StubFromRequest } = require('./Stub');

const router = require('../router')({
  items: stubs,
  builderFn: StubFromRequest,
  names: { many: 'stubs', one: 'stub' }
});

async function middleware(req, res, next) {
  try {
    const { originalUrl, method, headers, body } = req;

    const matchedStub = stubs.get(originalUrl, method, headers, body);
    if (matchedStub) {
      interactions.addInteraction({ ...matchedStub.toJson(), type: 'stubs' });
      const response = matchedStub.getResponse();
      return await response.respond(res);
    } else {
      logger.debug(`No stubs matched request ${req.originalUrl}`);
      return next();
    }
  } catch (e) {
    logger.warn(`An error occurred trying to match stub against ${req.originalUrl} ${e}`);
    return next();
  }
}

module.exports = { middleware, router };
