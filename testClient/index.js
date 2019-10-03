import axios from 'axios';

async function stub(stubDefinition) {
  await axios.post('/stubs/new', {
    requestMatcher: { url: stubDefinition.url, method: stubDefinition.method },
    response: {
      type: stubDefinition.type,
      body: stubDefinition.body,
      statusCode: stubDefinition.statusCode
    }
  });
}

function get(url) {
  return {
    returns: (type, body, status) => ({
      url,
      method: 'GET',
      type,
      body,
      statusCode: status
    })
  };
}

function post(url) {
  return {
    returns: (type, body, status) => ({
      url,
      method: 'POST',
      type,
      body,
      statusCode: status
    })
  };
}

function request(method, url) {
  switch (method) {
    case 'GET':
      return get(url);
    case 'POST':
      return post(url);
    default:
      throw new Error('Not yet');
  }
}

async function createCrud(url, idAlias) {
  await axios.post('/cruds/new', { url, idAlias });
}

async function proxyRequests(url, proxyUrl) {
  await axios.post('/proxy/new', {
    requestMatcher: { url },
    proxy: { destination: { url: proxyUrl } }
  });
}

export default {
  stub,
  get,
  post,
  request,
  createCrud,
  proxyRequests
};
