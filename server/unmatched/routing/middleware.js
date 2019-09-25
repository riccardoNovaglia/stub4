const log = require('../../logger');
const unmatched = require('../unmatched');

function middleware(req, _, next) {
  unmatched.addUnmatch(req.originalUrl, req.method);
  next();
}

module.exports = middleware;
