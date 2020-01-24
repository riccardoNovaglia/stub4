const { get } = require('lodash');

const Outcome = (outcome, defaultResponse) => {
  const toMatch = Object.keys(outcome.match);

  return {
    outcome,

    matchesMaps(variablesMaps) {
      const maps = variablesMaps.map(varMap =>
        Object.keys(varMap).map(key => varMap[key].toString() === outcome.match[key].toString())
      );
      const flattenedMatches = [].concat(...maps);
      return flattenedMatches.reduce((prev, current) => prev && current);
    },
    matchesBody(body) {
      if (!body) return false;
      return toMatch.every(key =>
        body[key] ? outcome.match[key].toString() === body[key].toString() : false
      );
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
