function MethodMatcher(method) {
  if (method === undefined || method === null || method === '*') return NoopMatcher();

  return {
    method: method.toUpperCase(),
    matches(method) {
      return this.method === method.toUpperCase();
    },
    equals(otherMatcher) {
      return this.method === otherMatcher.method;
    },
    pretty() {
      return this.method.toString();
    },
    toJson() {
      return this.method.toUpperCase();
    }
  };
}

const NoopMatcher = () => ({
  method: '*',
  matches: () => true,
  equals: otherMatcher => typeof otherMatcher === 'NoopMatcher',
  pretty: () => '*',
  toJson: () => '*'
});

module.exports = { MethodMatcher };
