const _ = require('lodash');

function getMatching(req) {
  // const method = _.get(req.body, 'requestMatcher.method', 'GET');
  // const url = _.get(req.body, 'requestMatcher.url');
  // const contract = _.get(req.body, 'contract');

  // if (!url) throw new Error('A request matcher url must be provided!');

  const url = req.body.matching.url;
  const variableStart = url.indexOf('{');
  const variableEnd = url.indexOf('}');
  const variableName = url.slice(variableStart + 1, variableEnd);
  const regex = new RegExp(url.replace(`{${variableName}}`, '(.*)'), 'i');

  return { url: req.body.matching.url, regex, variableName };
}

module.exports = getMatching;
