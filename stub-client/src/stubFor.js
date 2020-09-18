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
// TODO: this is getting terrible...
async function stubFor(requestMatcher, response) {
  // all-in-one
  if (response === undefined) {
    switch (true) {
      case has(requestMatcher, 'response'):
        return await post(urlFor(requestMatcher, 'stubs'), requestMatcher);
      case has(requestMatcher, 'crud'):
        return await post(urlFor(requestMatcher, 'cruds'), requestMatcher);
      case has(requestMatcher, 'proxy'):
        return await post(urlFor(requestMatcher, 'proxy'), requestMatcher);
      case has(requestMatcher, 'scenarios'):
        return await post(urlFor(requestMatcher, 'scenarios'), requestMatcher);
      default:
        console.log('not done yet');
        break;
    }
  }

  const endpoint = getSetupEndopoint(response.toJson());

  return await post(endpoint, {
    requestMatcher: requestMatcher.toJson(),
    ...response.toJson()
  });
}

function urlFor(requestMatcher, itemType) {
  const idIfPresent = requestMatcher && requestMatcher.id !== undefined ? requestMatcher.id : '';
  return `/${itemType}/${idIfPresent}`;
}

function has(item, key) {
  return item && item[key] !== undefined;
}

async function post(url, data) {
  try {
    const response = await ax.post(url, data);
    return response.data;
  } catch (e) {
    throw new Error(
      `An error occurred building stub: \n${e.message} \n${e.response && e.response.data}`
    );
  }
}

function getSetupEndopoint(response) {
  if (has(response, 'proxy')) return '/proxy';
  else if (has(response, 'crud')) return '/cruds';
  else if (has(response, 'scenarios')) return '/scenarios';

  return '/stubs';
}

module.exports = { stubFor, setPort, getPort, ax, stubsPort };
