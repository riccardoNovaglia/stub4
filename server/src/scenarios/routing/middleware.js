const log = require('../../logger');
const scenarios = require('../scenarios');

function middleware(req, res, next) {
  try {
    const url = req.originalUrl;
    // const method = req.method;

    const response = scenarios.get(url);

    return res.status(response.statusCode).send(response.body);
  } catch (e) {
    log('Not a scenario', e);
    return next();
  }
}

module.exports = middleware;
