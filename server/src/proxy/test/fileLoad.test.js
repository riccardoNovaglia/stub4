const { clear, get, add } = require('../Proxys');
const { ProxyFromFile } = require('../Proxy');

describe('Loading proxy from an initialiser file', () => {
  afterEach(clear);

  it('creates a proxy with some data', async () => {
    add(
      ProxyFromFile({
        requestMatcher: { url: '/some-url' },
        proxy: { destinationUrl: '/something' }
      })
    );

    const item = get('/some-url', 'GET', [], {});
    const { requestMatcher, proxy } = item.toJson();
    expect(requestMatcher.url).toEqual('/some-url');
    expect(requestMatcher.method).toEqual('*');
    expect(proxy.destinationUrl).toEqual('/something');
  });

  it('loads multiple proxy', async () => {
    add(
      ProxyFromFile({
        requestMatcher: { url: '/bananas/v21' },
        proxy: { destinationUrl: '/patatas/v22' }
      })
    );
    add(
      ProxyFromFile({
        requestMatcher: { url: '/beans', method: 'POST' },
        proxy: { destinationUrl: '/peas' }
      })
    );

    const bananas = get('/bananas/v21', 'GET', [], {});

    const { requestMatcher: r1, proxy: p1 } = bananas.toJson();
    expect(r1.url).toEqual('/bananas/v21');
    expect(r1.method).toEqual('*');
    expect(p1).toEqual({ destinationUrl: '/patatas/v22' });

    const beans = get('/beans', 'POST', [], {});

    const { requestMatcher: r2, proxy: p2 } = beans.toJson();
    expect(r2.url).toEqual('/beans');
    expect(r2.method).toEqual('POST');
    expect(p2).toEqual({ destinationUrl: '/peas' });
  });
});
