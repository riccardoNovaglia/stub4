function containsScenarios(outcomes, defaultOutcome) {
  return {
    toJson() {
      return {
        scenarios: { outcomes, default: defaultOutcome }
      };
    }
  };
}

module.exports = { containsScenarios };
