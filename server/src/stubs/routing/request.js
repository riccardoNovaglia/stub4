const _ = require('lodash');

function getRequestMatcher(req) {
  const method = _.get(req.body, 'requestMatcher.method', 'GET');
  const url = _.get(req.body, 'requestMatcher.url');

  if (!url) throw new Error('A request matcher url must be provided!');

  return { method, url };
}

module.exports = getRequestMatcher;
