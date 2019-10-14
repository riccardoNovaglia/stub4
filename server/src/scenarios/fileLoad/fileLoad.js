const _ = require('lodash');
const log = require('../../logger');
const { ScenarioFromFile } = require('../Scenario');
const scenarios = require('../routing/scenarios');

function loadFromFile(staticScenarios) {
  staticScenarios.forEach(scenario => {
    try {
      const builtScenario = ScenarioFromFile(scenario);
      scenarios.add(builtScenario);
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = loadFromFile;
