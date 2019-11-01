const _ = require('lodash');

const UrlMatcher = require('../scenarios/UrlMatcher');
const BodyMatcher = require('../stubs/BodyMatcher');

function Stub(urlMatcher, method, bodyMatcher, response, contract) {
  return {
    urlMatcher,
    method,
    bodyMatcher,
    response,
    contract,
    matches(url, method, body) {
      // console.log('matching', url, method, body);
      return urlMatcher.matches(url) && this.method === method && bodyMatcher.matches(body);
    }
  };
}

function Response(response) {
  const type = _.get(response, 'type', 'json');
  const body = _.get(response, 'body', type === 'json' ? {} : '');
  const statusCode = _.get(response, 'statusCode', 200);
  const contentType = type === 'json' ? 'application/json' : 'text/plain';
  const res = {
    body,
    contentType,
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
