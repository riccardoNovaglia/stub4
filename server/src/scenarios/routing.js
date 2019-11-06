const { log } = require('../logger');
const scenarios = require('./Scenarios');

const { ScenarioFromRequest } = require('./Scenario');

const router = require('../router')(scenarios, ScenarioFromRequest, {
  many: 'scenarios',
  one: 'scenario'
});

function middleware(req, res, next) {
  try {
    const url = req.originalUrl;
    const body = req.body;

    const response = scenarios.get(url, body);

    return res.status(response.statusCode).send(response.body);
  } catch (e) {
    log('Not a scenario', e);
    return next();
  }
}

module.exports = { middleware, router };
