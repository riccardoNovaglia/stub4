const _ = require('lodash');

function extractResponse(req) {
  const type = _.get(req.body, 'response.type', 'json');
  const body = _.get(req.body, 'response.body', type === 'json' ? {} : '');
  const contentType = type === 'json' ? 'application/json' : 'text/plain';
  return { body, contentType };
}

module.exports = extractResponse;
