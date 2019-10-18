const { ScenarioFromFile } = require('../Scenario');
const scenarios = require('../routing/scenarios');

function loadFromFile(staticScenarios) {
  if (!staticScenarios) return;

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
