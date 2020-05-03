const _ = require('lodash');

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
  const delay = _.get(response, 'delay', undefined);
  return {
    body,
    contentType: contentType(type),
    statusCode,
    delay
  };
}

module.exports = {
  Response
};
