const _ = require('lodash');

const { RequestMatcher } = require('../matching/RequestMatcher');
const { Response } = require('../response/Response');
const { createLogger } = require('../logger');

const logger = createLogger('stubs');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function Stub(requestMatcher, response, contract) {
  const data = { response, contract, requestMatcher, interactions: 0 };

  const stub = {
    ...data,
    matches(url, method, headers, body) {
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
      return this.requestMatcher.equals(otherStub.requestMatcher);
    },
    toJson() {
      return {
        requestMatcher: this.requestMatcher.toJson(),
        response: this.response
      };
    },
    addInteraction() {
      this.interactions = this.interactions + 1;
    },
    getResponse() {
      this.addInteraction();

      return this.response;
    }
  };

  return stub;
}

function StubFromRequest(req) {
  const { requestMatcher, response, contract } = req.body;

  return Stub(RequestMatcher(requestMatcher), Response(response), contract);
}

function StubFromFile(stubDef) {
  const { requestMatcher, response, contract } = stubDef;

  return Stub(RequestMatcher(requestMatcher), Response(response), contract);
}

module.exports = { Stub, StubFromRequest, StubFromFile };
