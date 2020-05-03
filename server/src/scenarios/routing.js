const { createLogger } = require('../logger');
const scenarios = require('./Scenarios');

const { ScenarioFromRequest } = require('./Scenario');

const router = require('../router')({
  items: scenarios,
  builderFn: ScenarioFromRequest,
  names: { many: 'scenarios', one: 'scenario' }
});

const logger = createLogger('scenarios');

async function middleware(req, res, next) {
  const { originalUrl, method, headers, body } = req;
  try {
    const scenario = scenarios.get(originalUrl, method, headers, body);
    if (scenario) {
      const response = scenario.getResponse(originalUrl, body);
      return await response.respond(res);
    } else {
      return next();
    }
  } catch (e) {
    logger.error(`An error occurred trying to get scenarios for ${req.originalUrl}`, e);
    return next();
  }
}

module.exports = { middleware, router };
