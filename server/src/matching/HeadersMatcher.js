const { transform } = require('lodash');

function lowercased(item) {
  return transform(item, (obj, value, key) => (obj[key.toLowerCase()] = value));
}

function HeadersMatcher(headers) {
  if (headers === undefined || headers === []) return NoopMatcher();

  return {
    headers: lowercased(headers),
    keys: Object.keys(headers).map((key) => key.toLowerCase()),
    matches(headers) {
      const lowercasedH = lowercased(headers);
      return this.keys.every((key) => lowercasedH[key] === this.headers[key]);
    },
    equals(otherMatcher) {
      return this.headers === otherMatcher.headers;
    },
    pretty() {
      return this.headers.toString();
    },
    toJson() {
      return this.headers;
    }
  };
}

const NoopMatcher = () => ({
  matches: () => true,
  equals: (otherMatcher) => typeof otherMatcher === 'NoopMatcher',
  pretty: () => '[]',
  toJson: () => undefined
});

module.exports = { HeadersMatcher };
