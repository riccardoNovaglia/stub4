const _ = require('lodash');
const log = require('../../logger');
const stubs = require('../stubbing');

function loadFromFile(staticStubs) {
  staticStubs.forEach(stub => {
    try {
      const request = getRequestMatcher(stub.requestMatcher);
      const response = extractResponse(stub.response);

      stubs.add(request, response);
    } catch (e) {
      log(e);
    }
  });
}

function getRequestMatcher(matcher) {
  const method = _.get(matcher, 'method', 'GET');
  const url = _.get(matcher, 'url');
  const contract = _.get(matcher, 'contract');

  if (!url) throw new Error('A request matcher url must be provided!');

  return { method, url, contract };
}
function extractResponse(response) {
  const type = _.get(response, 'type', 'json');
  const body = _.get(response, 'body', type === 'json' ? {} : '');
  const statusCode = _.get(response, 'statusCode', 200);
  const contentType = type === 'json' ? 'application/json' : 'text/plain';
  return { body, contentType, statusCode };
}

module.exports = loadFromFile;
