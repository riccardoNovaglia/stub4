const { getAxios } = require('./axios');

let ax = getAxios(8080);

function setPort(port) {
  ax = getAxios(port);
}

async function stubFor(requestMatcher, response) {
  const endpoint = getSetupEndopoint(response);

  const responseStuff = response.crud ? response.toJson() : response;

  await ax.post(endpoint, {
    requestMatcher: requestMatcher.toJson(),
    ...responseStuff
  });
}

function getSetupEndopoint(response) {
  if (response.proxy) return '/proxy';
  else if (response.crud) return '/cruds';
  else if (response.scenarios) return '/scenarios';

  return '/stubs';
}

module.exports = { stubFor, setPort };
