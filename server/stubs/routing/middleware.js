const stubs = require('../stubbing');

function middleware(req, res, next) {
  try {
    const url = req.originalUrl;

    const matchedStub = stubs.get(url);
    stubs.countUp(url);
    return res
      .set('Content-Type', matchedStub.response.contentType)
      .status(matchedStub.response.statusCode)
      .send(matchedStub.response.body);
  } catch (e) {
    next();
  }
}

module.exports = middleware;
