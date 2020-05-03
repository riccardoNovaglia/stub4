const { Response } = require('../response/Response');

const Outcome = (outcome) => {
  const toMatch = Object.keys(outcome.match);
  const response = Response(outcome.response);

  return {
    outcome,
    response,

    matchesMaps(variablesMaps) {
      const maps = variablesMaps.map((varMap) =>
        Object.keys(varMap).map((key) => varMap[key].toString() === outcome.match[key].toString())
      );
      const flattenedMatches = [].concat(...maps);
      return flattenedMatches.reduce((prev, current) => prev && current);
    },
    matchesBody(body) {
      if (!body) return false;
      return toMatch.every((key) =>
        body[key] ? outcome.match[key].toString() === body[key].toString() : false
      );
    },
    toJson() {
      return outcome;
    }
  };
};

module.exports = Outcome;
