const { has } = require('lodash');
const { getAxios } = require('./axios');

let ax = getAxios(8080);

function setPort(port) {
  ax = getAxios(port);
}

// TODO: filter undefined properties?
async function stubFor(requestMatcher, response) {
  // all-in-one
  if (response === undefined) {
    switch (true) {
      case has(requestMatcher, 'response'):
        return await ax.post('/stubs', requestMatcher);
      case has(requestMatcher, 'crud'):
        return await ax.post('/cruds', requestMatcher);
      default:
        console.log('not done yet');
        break;
    }
  }

  const endpoint = getSetupEndopoint(response.toJson());

  await ax.post(endpoint, {
    requestMatcher: requestMatcher.toJson(),
    ...response.toJson()
  });
}

function getSetupEndopoint(response) {
  if (has(response, 'proxy')) return '/proxy';
  else if (has(response, 'crud')) return '/cruds';
  else if (has(response, 'scenarios')) return '/scenarios';

  return '/stubs';
}

module.exports = { stubFor, setPort };
