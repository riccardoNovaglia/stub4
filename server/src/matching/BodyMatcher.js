const _ = require('lodash');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const xml2js = require('xml2js');

const builder = new xml2js.Builder();

const { createLogger } = require('../logger');

const logger = createLogger('bodyM');

const BodyMatcher = body => {
  if (_.isEmpty(body)) return NoopMatcher;
  if (_.get(body, 'type') === 'xml') return XMLMatcher(body.bodyMatch);

  const keys = Object.keys(body.bodyMatch);

  return {
    body: body.bodyMatch,
    keys,
    matches(body) {
      if (_.isEmpty(body)) return false;

      return keys.every(k => this.body[k] === '*' || body[k] === this.body[k]);
    },
    pretty: () => JSON.stringify(body.bodyMatch),
    toJson() {
      return {
        body: this.body,
        type: 'json'
      };
    }
  };
};

const XMLMatcher = body => {
  return {
    body,
    matches(body) {
      const xml = builder.buildObject(body);
      const doc = new dom().parseFromString(xml);

      return this.body.every(({ path, value }) => {
        const selectedValue = xpath.select(path, doc);
        logger.debug(
          `Using path '${JSON.stringify(path)}' 
          to match from '${JSON.stringify(xml)}' 
          Extracted '${selectedValue}' 
          Comparing '${value}'`
        );

        return selectedValue === value;
      });
    },
    pretty: () => JSON.stringify(body),
    toJson() {
      return {
        body: this.body,
        type: 'xml'
      };
    }
  };
};

const NoopMatcher = {
  matches: () => true,
  pretty: () => '*',
  toJson: () => undefined
};

module.exports = BodyMatcher;
