const { get, omit } = require('lodash');

const Outcome = (outcome, defaultResponse) => {
  const toMatch = Object.keys(omit(outcome, 'response'));

  return {
    outcome,

    matchesMaps(variablesMaps) {
      const maps = variablesMaps.map(varMap =>
        Object.keys(varMap).map(key => varMap[key].toString() === outcome[key].toString())
      );
      const flattenedMatches = [].concat(...maps);
      return flattenedMatches.reduce((prev, current) => prev && current);
    },
    matchesBody(body) {
      return toMatch
        .map(key => (body[key] ? outcome[key].toString() === body[key].toString() : false))
        .reduce((p, n) => p && n);
    },
    toResponse() {
      return {
        body: get(this, 'outcome.response.body', defaultResponse.body),
        statusCode: get(this, 'outcome.response.statusCode', defaultResponse.statusCode)
      };
    }
  };
};

module.exports = Outcome;
