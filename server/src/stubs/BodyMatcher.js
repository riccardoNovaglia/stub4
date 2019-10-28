const _ = require('lodash');

const BodyMatcher = body => {
  if (_.isEmpty(body)) return NoopMatcher;

  const keys = Object.keys(body);

  return {
    body,
    keys,
    matches(body) {
      if (_.isEmpty(body)) return false;

      return keys.map(k => body[k] === this.body[k]).reduce((a, b) => a && b);
    }
  };
};

const NoopMatcher = {
  matches: () => true
};

module.exports = BodyMatcher;
