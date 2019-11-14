const _ = require('lodash');

const UrlMatcher = require('../scenarios/UrlMatcher');
const BodyMatcher = require('../stubs/BodyMatcher');

const { createLogger } = require('../logger');

const logger = createLogger('stubs');

function Stub(urlMatcher, method, bodyMatcher, response, contract) {
  const data = { urlMatcher, method, bodyMatcher, response, contract };

  const stub = {
    ...data,
    matches(url, method, body) {
      logger.silly(`${this.pretty()} attempting to match ${method} ${url} ${JSON.stringify(body)}`);
      const matched =
        urlMatcher.matches(url) && this.method === method && bodyMatcher.matches(body);
      matched && logger.debug(`${this.pretty()} is a match`);
      return matched;
    },
    pretty() {
      return `'${method} ${urlMatcher.pretty()} ${bodyMatcher.pretty()}'`;
    },
    prettyJson() {
      return JSON.stringify(data, null, 2);
    }
  };

  return stub;
}

function contentType(type) {
  switch (type) {
    case 'json':
      return 'application/json';
    case 'xml':
      return 'application/xml';
    case 'text':
      return 'text/plain';
    default:
      return 'text/plain';
  }
}

function Response(response) {
  const type = _.get(response, 'type', 'json');
  const body = _.get(response, 'body', type === 'json' ? {} : '');
  const statusCode = _.get(response, 'statusCode', 200);
  const res = {
    body,
    contentType: contentType(type),
    statusCode
  };

  return {
    response: res,
    toResponse() {
      return res;
    }
  };
}

function StubFromRequest(req) {
  const url = _.get(req.body, 'requestMatcher.url');
  if (!url) throw new Error('A request matcher url must be provided!');

  logger.silly(`Building stub out of ${JSON.stringify(req.body, null, 2)}`);

  const urlMatcher = UrlMatcher(req.body.requestMatcher.url);
  const bodyMatcher = BodyMatcher(req.body.requestMatcher.body);
  const body = _.get(req.body, 'requestMatcher.body');

  const contract = req.body.contract;

  const method = _.get(req.body, 'requestMatcher.method', _.isEmpty(body) ? 'GET' : 'POST');
  const response = Response(req.body.response);
  return Stub(urlMatcher, method, bodyMatcher, response.toResponse(), contract);
}

function StubFromFile(stubDef) {
  const url = stubDef.requestMatcher.url;
  if (!url) throw new Error('A request matcher url must be provided!');

  const urlMatcher = UrlMatcher(url);
  const body = stubDef.requestMatcher.body;
  const bodyMatcher = BodyMatcher(body);

  const contract = stubDef.contract;

  const method = _.get(stubDef, 'requestMatcher.method', _.isEmpty(body) ? 'GET' : 'POST');
  const response = Response(stubDef.response);
  return Stub(urlMatcher, method, bodyMatcher, response.toResponse(), contract);
}

module.exports = { Stub, StubFromRequest, StubFromFile };
