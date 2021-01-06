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

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function Response(response) {
  const type = _.get(response, 'contentType', 'json');
  const body = _.get(response, 'body', type === 'json' ? {} : '');
  const statusCode = _.get(response, 'statusCode', 200);
  const delay = _.get(response, 'delay', undefined);
  return {
    body,
    contentType: contentType(type),
    statusCode,
    delay,

    async respond(res) {
      if (this.delay !== undefined) {
        await sleep(this.delay);
      }

      return res.set('Content-Type', this.contentType).status(this.statusCode).send(this.body);
    },
    toJson() {
      return {
        body: this.body,
        contentType: this.contentType,
        statusCode: this.statusCode
      };
    }
  };
}

module.exports = {
  Response
};
