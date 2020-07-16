const _ = require('lodash');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const xml2js = require('xml2js');

const builder = new xml2js.Builder();

const { createLogger } = require('../logger');

const logger = createLogger('bodyM');

function BodyMatcher(bodyMatcher) {
  if (_.isEmpty(bodyMatcher)) return NoopMatcher;
  if (_.get(bodyMatcher, 'type') === 'xml') return XMLMatcher(bodyMatcher.value);

  const keys = Object.keys(bodyMatcher.value);

  return {
    value: bodyMatcher.value,
    keys,
    matches(body) {
      if (_.isEmpty(body)) return false;

      return keys.every((k) => this.value[k] === '*' || body[k] === this.value[k]);
    },
    pretty() {
      return JSON.stringify(this.value);
    },
    toJson() {
      return {
        value: this.value,
        keys: this.keys,
        type: 'json'
      };
    }
  };
}

const XMLMatcher = (body) => {
  return {
    value: body,
    matches(body) {
      const xml = builder.buildObject(body);
      const doc = new dom().parseFromString(xml);

      return this.value.every(({ path, value }) => {
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
    pretty() {
      return JSON.stringify(this.value);
    },
    toJson() {
      return {
        value: this.value,
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

module.exports = { BodyMatcher };
