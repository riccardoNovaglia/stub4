const { clear, get, add } = require('../Proxys');
const { ProxyFromFile } = require('../Proxy');

describe('Loading proxy from an initialiser file', () => {
  afterEach(clear);

  it('creates a proxy with some data', async () => {
    add(
      ProxyFromFile({
        requestMatcher: { url: '/some-url' },
        destination: { url: '/something' }
      })
    );

    const proxy = get('/some-url', 'GET', [], {});

    expect(proxy.requestMatcher.urlMatcher.url).toEqual('/some-url');
    expect(proxy.requestMatcher.methodMatcher.method).toEqual('*');
    expect(proxy.proxyUrl).toEqual('/something');
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

    const bananas = get('/bananas/v21', 'GET', [], {});

    expect(bananas.requestMatcher.urlMatcher.url).toEqual('/bananas/v21');
    expect(bananas.requestMatcher.methodMatcher.method).toEqual('*');
    expect(bananas.proxyUrl).toEqual('/patatas/v22');

    const beans = get('/beans', 'POST', [], {});

    expect(beans.requestMatcher.urlMatcher.url).toEqual('/beans');
    expect(beans.requestMatcher.methodMatcher.method).toEqual('POST');
    expect(beans.proxyUrl).toEqual('/peas');
  });
});
