const { clear, get, add } = require('../Proxys');
const { ProxyFromFile } = require('../Proxy');

jest.mock('axios', () => ({
  request: someRequest => {
    return Promise.resolve({ request: someRequest });
  }
}));

describe('Loading proxy from an initialiser file', () => {
  afterEach(clear);

  it('creates a proxy with some data', async () => {
    add(
      ProxyFromFile({
        requestMatcher: { url: '/some-url' },
        destination: { url: '/something' }
      })
    );

    expect(get('/some-url', 'GET')).resolves.toEqual({
      request: {
        url: '/something',
        method: 'GET'
      }
    });
  });

  it('loads multiple proxy', async () => {
    add(
      ProxyFromFile({
        requestMatcher: { url: '/bananas/v21' },
        destination: { url: '/patatas/v22' }
      })
    );
    add(
      ProxyFromFile({
        requestMatcher: { url: '/beans', method: 'POST' },
        destination: { url: '/peas' }
      })
    );

    expect(get('/bananas/v21', 'GET')).resolves.toEqual({
      request: { url: '/patatas/v22', method: 'GET' }
    });
    expect(get('/beans', 'POST')).resolves.toEqual({ request: { url: '/peas', method: 'POST' } });
  });
});
