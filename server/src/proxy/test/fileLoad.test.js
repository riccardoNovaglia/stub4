const { clear, get, add } = require('../Proxys');
const { ProxyFromFile } = require('../Proxy');

describe('Loading proxy from an initialiser file', () => {
  afterEach(clear);

  it('creates a proxy with some data', async () => {
    add(
      ProxyFromFile({
        requestMatcher: { url: '/some-url' },
        proxy: { destination: { url: '/something' } }
      })
    );

    const proxy = get('/some-url', 'GET', [], {});
    const { requestMatcher, proxyUrl } = proxy.toJson();
    expect(requestMatcher.url).toEqual('/some-url');
    expect(requestMatcher.method).toEqual('*');
    expect(proxyUrl).toEqual('/something');
  });

  it('loads multiple proxy', async () => {
    add(
      ProxyFromFile({
        requestMatcher: { url: '/bananas/v21' },
        proxy: { destination: { url: '/patatas/v22' } }
      })
    );
    add(
      ProxyFromFile({
        requestMatcher: { url: '/beans', method: 'POST' },
        proxy: { destination: { url: '/peas' } }
      })
    );

    const bananas = get('/bananas/v21', 'GET', [], {});

    expect(bananas.requestMatcher.toJson().url).toEqual('/bananas/v21');
    expect(bananas.requestMatcher.toJson().method).toEqual('*');
    expect(bananas.proxyUrl).toEqual('/patatas/v22');

    const beans = get('/beans', 'POST', [], {});

    expect(beans.requestMatcher.toJson().url).toEqual('/beans');
    expect(beans.requestMatcher.toJson().method).toEqual('POST');
    expect(beans.proxyUrl).toEqual('/peas');
  });
});
