const _ = require('lodash');

const { RequestMatcher } = require('../matching/RequestMatcher');
const { createLogger } = require('../logger');

const logger = createLogger('stubs');

function Stub(requestMatcher, response, contract) {
  const data = { response, contract, requestMatcher };

  const stub = {
    ...data,
    matches(url, method, body) {
      logger.silly(`${this.pretty()} attempting to match ${method} ${url} ${JSON.stringify(body)}`);
      const matched = this.requestMatcher.matches({ url, method, body });
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
    }
  };

  return stub;
}

function contentType(type) {
  switch (type) {
    case 'json':
    case 'application/json':
      return 'application/json';
    case 'xml':
    case 'application/xml':
      return 'application/xml';
    case 'text':
    case 'text/plain':
      return 'text/plain';
    default:
      return 'text/plain';
  }
}

function Response(response) {
  const type = _.get(response, 'type', 'json');
  const body = _.get(response, 'body', type === 'json' ? {} : '');
  const statusCode = _.get(response, 'statusCode', 200);
  return {
    body,
    contentType: contentType(type),
    statusCode
  };
}

function StubFromRequest(req) {
  // TODO: maybe move to request/url matcher
  const url = _.get(req.body, 'requestMatcher.url');
  if (!url) throw new Error('A request matcher url must be provided!');

  const requestMatcher = RequestMatcher(req.body.requestMatcher);
  const response = Response(req.body.response);
  const contract = req.body.contract;

  return Stub(requestMatcher, response, contract);
}

function StubFromFile(stubDef) {
  const url = stubDef.requestMatcher.url;
  if (!url) throw new Error('A request matcher url must be provided!');

  const requestMatcher = RequestMatcher(stubDef.requestMatcher);
  const response = Response(stubDef.response);
  const contract = stubDef.contract;

  return Stub(requestMatcher, response, contract);
}

module.exports = { Stub, StubFromRequest, StubFromFile };
