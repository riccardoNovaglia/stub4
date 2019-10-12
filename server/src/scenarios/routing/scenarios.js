const _ = require('lodash');

const scenarios = [];
// const interactions = [];

function add(scenario) {
  scenarios.push(scenario);
}

function get(url) {
  const matchedScenario = scenarios.find(scenario => scenario.matches(url));

  return matchedScenario.getResponseFor(url);
}

// function getInteraction(url) {
//   return interactions.find(interaction => interaction.url === url);
// }

function all() {
  return scenarios;
}

function clearAll() {
  scenarios.length = 0;
  // interactions.length = 0;
}

// function forEach(fn) {
//   scenarios.forEach(stub => fn(stub));
// }

// function count(url) {
//   const interaction = getInteraction(url);
//   return _.get(interaction, 'count', 0);
// }

// function countUp(url) {
//   const interaction = getInteraction(url);
//   interaction ? (interaction.count += 1) : interactions.push({ url, count: 1 });
// }

module.exports = {
  add,
  all,
  clearAll,
  get
  // forEach,
  // countUp,
  // count
};
