const _ = require('lodash');

function getRequestMatcher(req) {
  const method = _.get(req.body, 'requestMatcher.method', 'GET');
  const url = _.get(req.body, 'requestMatcher.url');
  const contract = _.get(req.body, 'contract');

  if (!url) throw new Error('A request matcher url must be provided!');

  return { method, url, contract };
}

module.exports = getRequestMatcher;
