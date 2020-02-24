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

  const count = stubs.count(url);
  return res.send({ count });
});

function middleware(req, res, next) {
  try {
    const url = req.originalUrl;
    const method = req.method;

    const matchedStub = stubs.get(url, method, req.headers, req.body);
    if (matchedStub) {
      stubs.countUp(url);

      return res
        .set('Content-Type', matchedStub.response.contentType)
        .status(matchedStub.response.statusCode)
        .send(matchedStub.response.body);
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
