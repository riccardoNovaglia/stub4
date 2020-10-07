const _ = require('lodash');
const { v4: uuid } = require('uuid');

const { RequestMatcher } = require('../matching/RequestMatcher');
const { Response } = require('../response/Response');
const { createLogger } = require('../logger');

const logger = createLogger('stubs');

function Stub({ id = uuid(), enabled = true, requestMatcher, response, contract }) {
  const data = { response, contract, requestMatcher };

  const stub = {
    ...data,
    id,
    enabled,
    matches(url, method, headers, body) {
      if (!this.enabled) return false;

      logger.silly(`${this.pretty()} attempting to match ${method} ${url} ${JSON.stringify(body)}`);
      const matched = this.requestMatcher.matches({ url, method, headers, body });
      matched && logger.debug(`${this.pretty()} is a match`);
      return matched;
    },
    pretty() {
      return `'${requestMatcher.methodMatcher.pretty()} ${requestMatcher.urlMatcher.pretty()} ${requestMatcher.bodyMatcher.pretty()}'`;
    },
    prettyJson() {
      return JSON.stringify(data, null, 2);
    },
    equals(otherStub) {
      // TODO: can probably start using id? Not infallible tho isn't it?
      // Maybe there should be an 'equal' and an 'equivalent' to say it's not the same, but matches the same
      return this.requestMatcher.equals(otherStub.requestMatcher);
    },
    toJson() {
      return {
        id: this.id,
        enabled: this.enabled,
        requestMatcher: this.requestMatcher.toJson(),
        response: this.response
      };
    },
    getResponse() {
      return this.response;
    },
    setEnabled(enabled) {
      this.enabled = enabled;
      return this.enabled;
    }
  };

  return stub;
}

function StubFromRequest(req) {
  return StubFromItem(req.body);
}

function StubFromFile(stubDef) {
  return StubFromItem(stubDef);
}

function StubFromJs(stubDef) {
  return StubFromItem(stubDef);
}

function StubFromItem(item) {
  const { id, enabled, requestMatcher, response, contract } = item;

  return Stub({
    id,
    enabled,
    requestMatcher: RequestMatcher(requestMatcher),
    response: Response(response),
    contract
  });
}

module.exports = { Stub, StubFromRequest, StubFromFile, StubFromJs };
