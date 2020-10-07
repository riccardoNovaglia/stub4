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

function getById(id) {
  return scenarios.find((scenario) => scenario.id === id);
}

function updateById(id, newScenario) {
  const scenarioIndex = scenarios.findIndex((scenario) => scenario.id === id);
  if (scenarioIndex !== -1) {
    scenarios[scenarioIndex] = newScenario;
    logger.silly(`Scenario ${id} successfully updated`);
    return scenarios[scenarioIndex];
  } else {
    logger.warn(`Attempted to update scenario with id ${id}, but couldn't find it!`);
    return undefined;
  }
}

function deleteById(id) {
  const scenarioIndex = scenarios.findIndex((scenario) => scenario.id === id);
  if (scenarioIndex !== -1) {
    scenarios.splice(scenarioIndex, 1);
  } else {
    logger.warn(`Attempted to delete scenario with id ${id}, but couldn't find it!`);
  }
}

function setEnabled(id, enabled) {
  const item = getById(id);
  if (item) {
    return item.setEnabled(enabled);
  } else {
    return undefined;
  }
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
  get,
  getById,
  updateById,
  deleteById,
  setEnabled
};
