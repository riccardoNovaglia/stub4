const _ = require('lodash');

function extractResponse(req) {
  const type = _.get(req.body, 'response.type', 'json');
  const body = _.get(req.body, 'response.body', type === 'json' ? {} : '');
  const statusCode = _.get(req.body, 'response.statusCode', 200);
  const contentType = type === 'json' ? 'application/json' : 'text/plain';
  return { body, contentType, statusCode };
}

module.exports = extractResponse;
