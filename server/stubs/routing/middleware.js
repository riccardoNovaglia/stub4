const stubs = require('../stubbing');

function middleware(req, res, next) {
  try {
    const matchedStub = stubs.get(req);
    return res
      .set('Content-Type', matchedStub.response.contentType)
      .status(matchedStub.response.statusCode)
      .send(matchedStub.response.body);
  } catch (e) {
    next();
  }
}

module.exports = middleware;
