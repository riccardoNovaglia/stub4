const scenarios = [];

function add(scenario) {
  scenarios.push(scenario);
}

function get(url, body) {
  const matchedScenario = scenarios.find(scenario => scenario.matches(url, body));

  return matchedScenario.getResponseFor(url, body);
}

function all() {
  return scenarios.slice().map(outcome => {
    let { urlMatcher, outcomes, defaultResponse } = outcome;
    urlMatcher.regex = urlMatcher.regex.toString();
    outcomes = outcomes.map(outcomeWrapper => outcomeWrapper.outcome);
    return { urlMatcher, outcomes, defaultResponse };
  });
}

function clearAll() {
  scenarios.length = 0;
}

module.exports = {
  add,
  all,
  clearAll,
  get
};