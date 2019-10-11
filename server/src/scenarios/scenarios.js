const _ = require('lodash');

const scenarios = [];
// const interactions = [];

const Scenario = (matching, defaultResponse, outcomes) => ({
  matching,
  defaultResponse,
  outcomes,
  mappedOutcomes: outcomes.map(outcome => Outcome(outcome)),
  defaultBody: () => defaultResponse.response.body,
  urlMatch(url) {
    return url.match(matching.regex)[1];
  },
  matches(url) {
    return !!this.urlMatch(url);
  },
  getResponseFor(url) {
    const matchedOutcome = this.mappedOutcomes.find(outcome => {
      return outcome.matches(this.matching.variableName.toString(), this.urlMatch(url));
    });

    return {
      ...this.defaultBody(),
      ...(matchedOutcome ? matchedOutcome.body() : {})
    };
  }
});

function Outcome(outcome) {
  return {
    outcome,
    matches(variableName, variableValue) {
      return outcome[variableName].toString() === variableValue;
    },
    body() {
      return this.outcome.response.body;
    }
  };
}

function add(matching, defaultResponse, outcomes) {
  scenarios.push(Scenario(matching, defaultResponse, outcomes));
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
