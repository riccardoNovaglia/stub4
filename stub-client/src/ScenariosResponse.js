function containsScenarios(outcomes, defaultOutcome) {
  return {
    scenarios: true,
    outcomes,
    default: defaultOutcome
  };
}

module.exports = { containsScenarios };
