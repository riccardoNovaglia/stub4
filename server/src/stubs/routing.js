const { createLogger } = require('../logger');
const stubs = require('./Stubs');

const logger = createLogger('stubs');

const { StubFromRequest } = require('./Stub');

const router = require('../router')({
  items: stubs,
  builderFn: StubFromRequest,
  names: { many: 'stubs', one: 'stub' }
});

router.get('/count', (req, res) => {
  const url = req.body.url;

  const matchedStub = stubs.get(url, undefined, undefined, undefined);
  if (matchedStub) {
    const count = matchedStub.interactions;

    return res.send({ count });
  } else {
    return res.status(404);
  }
});

async function middleware(req, res, next) {
  try {
    const { originalUrl, method, headers, body } = req;

    const matchedStub = stubs.get(originalUrl, method, headers, body);
    if (matchedStub) {
      return await matchedStub.respond(res);
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
