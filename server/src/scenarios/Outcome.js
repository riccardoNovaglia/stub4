const _ = require('lodash');

const Outcome = (outcome, defaultResponse) => ({
  outcome,

  matchesMaps(variablesMaps) {
    return variablesMaps
      .map(varMap =>
        Object.keys(varMap).map(key => varMap[key].toString() === outcome[key].toString())
      )
      .flat()
      .reduce((prev, current) => prev && current);
  },
  toResponse() {
    return {
      body: _.get(this, 'outcome.response.body', defaultResponse.body),
      statusCode: _.get(this, 'outcome.response.statusCode', defaultResponse.statusCode)
    };
  }
});

module.exports = Outcome;
