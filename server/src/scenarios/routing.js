const { createLogger } = require('../logger');
const scenarios = require('./Scenarios');

const { ScenarioFromRequest } = require('./Scenario');

const router = require('../router')(scenarios, ScenarioFromRequest, {
  many: 'scenarios',
  one: 'scenario'
});

const logger = createLogger('scenarios');

function middleware(req, res, next) {
  try {
    const url = req.originalUrl;
    const body = req.body;

    const response = scenarios.get(url, body);
    if (response) {
      return res.status(response.statusCode).send(response.body);
    } else {
      return next();
    }
  } catch (e) {
    logger.error(`An error occurred trying to get scenarios for ${req.originalUrl}`);
    return next();
  }
}

module.exports = { middleware, router };
