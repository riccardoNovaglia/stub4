const _ = require('lodash');

function extractOutcomes(req) {
  // const body = _.get(data, 'response.body', type === 'json' ? {} : '');
  // const type = _.get(req.body, 'response.type', 'json');
  // const statusCode = _.get(req.body, 'response.statusCode', 200);
  // const contentType = type === 'json' ? 'application/json' : 'text/plain';
  const outcomes = req.body.outcomes;
  const defaultResponse = req.body.default;

  return { defaultResponse, outcomes };
}

module.exports = extractOutcomes;
