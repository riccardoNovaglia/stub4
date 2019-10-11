const log = require('../../logger');
const scenarios = require('../scenarios');

function middleware(req, res, next) {
  try {
    const url = req.originalUrl;
    // const method = req.method;

    // const matchedScenario = scenarios.get(url, method);
    const response = scenarios.get(url);
    // scenarios.countUp(url);

    // .set('Content-Type', matchedScenario.response.contentType)
    return res.status(200).send(response);
  } catch (e) {
    log('Not a scenario', e);
    return next();
  }
}

module.exports = middleware;
