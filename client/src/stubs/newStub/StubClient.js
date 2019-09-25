import axios from 'axios';

export async function stub(stubDefinition) {
  await axios.post('/stubs/new', {
    requestMatcher: { url: stubDefinition.url, method: stubDefinition.method },
    response: {
      type: stubDefinition.type,
      body: stubDefinition.body,
      statusCode: stubDefinition.statusCode
    }
  });
}

export function get(url) {
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

export function post(url) {
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

export function request(method, url) {
  switch (method) {
    case 'GET':
      return get(url);
    case 'POST':
      return post(url);
    default:
      throw new Error('Not yet');
  }
}
