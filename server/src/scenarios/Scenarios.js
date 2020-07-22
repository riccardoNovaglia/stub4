const { createLogger } = require('../logger');

const logger = createLogger('scenarios');

const scenarios = [];

function add(scenario) {
  logger.info(
    `Adding new scenario for ${scenario.requestMatcher.toJson().url} with ${
      scenario.outcomes.length
    } outcomes`
  );
  const existingScenario = scenarios.find((existing) =>
    existing.requestMatcher.equals(scenario.requestMatcher)
  );
  if (existingScenario) {
    scenarios.splice(scenarios.indexOf(existingScenario), 1);
  }
  scenarios.push(scenario);
}

function get(url, method, headers, body) {
  const matchedScenario = scenarios.find((scenario) =>
    scenario.matches(url, method, headers, body)
  );

  if (!matchedScenario) return undefined;
  else logger.debug('found matching scenario');

  return matchedScenario;
}

function all() {
  return scenarios.slice().map((scenario) => scenario.toJson());
}

function clear() {
  scenarios.length = 0;
}

module.exports = {
  add,
  all,
  clear,
  get
};
