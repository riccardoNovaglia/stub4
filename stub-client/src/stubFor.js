const { has } = require('lodash');
const { getAxios } = require('./axios');

let stubsPort = 8080;
let ax = getAxios(stubsPort);

function setPort(port) {
  stubsPort = port;
  ax = getAxios(stubsPort);
}

function getPort() {
  return stubsPort;
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
      case has(requestMatcher, 'proxy'):
        return await ax.post('/proxy', requestMatcher);
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

module.exports = { stubFor, setPort, getPort, ax, stubsPort };
