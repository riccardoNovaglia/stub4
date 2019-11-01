const log = require('../../logger');
const stubs = require('../stubbing');

function middleware(req, res, next) {
  try {
    const url = req.originalUrl;
    const method = req.method;

    const matchedStub = stubs.get(url, method, req.body);
    stubs.countUp(url);

    return res
      .set('Content-Type', matchedStub.response.contentType)
      .status(matchedStub.response.statusCode)
      .send(matchedStub.response.body);
  } catch (e) {
    log('Not a stub', e);
    return next();
  }
}

module.exports = middleware;
