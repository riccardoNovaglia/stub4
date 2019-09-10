import axios from 'axios';

export async function stub(stubDefinition) {
  await axios.post('/stubs/new', {
    requestMatcher: { url: stubDefinition.url, method: stubDefinition.method },
    response: { type: stubDefinition.type, body: stubDefinition.body }
  });
}

export function get(url) {
  return {
    returns: (type, body) => ({
      url,
      method: 'GET',
      type,
      body
    })
  };
}

export function post(url) {
  return {
    returns: (type, body) => ({
      url,
      method: 'POST',
      type,
      body
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
