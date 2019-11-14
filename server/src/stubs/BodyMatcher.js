const _ = require('lodash');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const xml2js = require('xml2js');

const builder = new xml2js.Builder();

const BodyMatcher = body => {
  if (_.isEmpty(body)) return NoopMatcher;
  if (_.get(body, 'type') === 'xml') return XMLMatcher(body.bodyMatch);

  const keys = Object.keys(body.bodyMatch);

  return {
    body: body.bodyMatch,
    keys,
    matches(body) {
      if (_.isEmpty(body)) return false;

      return keys.map(k => body[k] === this.body[k]).reduce((a, b) => a && b);
    },
    pretty: () => JSON.stringify(body.bodyMatch)
  };
};

const XMLMatcher = body => {
  return {
    body,
    matches(body) {
      const xml = builder.buildObject(body);
      const doc = new dom().parseFromString(xml);

      return this.body
        .map(({ path, value }) => xpath.select(path, doc) === value)
        .reduce((p, n) => p && n);
    },
    pretty: () => JSON.stringify(body)
  };
};

const NoopMatcher = {
  matches: () => true,
  pretty: () => '*'
};

module.exports = BodyMatcher;
