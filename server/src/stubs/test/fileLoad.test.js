const { clear, get, add } = require('../Stubs');
const { StubFromFile } = require('../Stub');

describe('Loading stubs from an initialiser file', () => {
  afterEach(clear);

  it('creates a stub with some response and fills all defaults', () => {
    add(
      StubFromFile({
        requestMatcher: { url: '/some-url' },
        response: { body: `this was setup`, type: 'text' }
      })
    );

    const item = get('/some-url', 'GET', undefined);
    expect(item.urlMatcher.url).toEqual('/some-url');
    expect(item.method).toEqual('GET');
    expect(item.response).toEqual({
      body: `this was setup`,
      contentType: 'text/plain',
      statusCode: 200
    });
  });

  it('creates a stub with some method and contract and response type and status', () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    add(
      StubFromFile({
        requestMatcher: { url: '/whatever', method: 'PATCH' },
        response: { body: { item: `whatever` }, type: 'json', statusCode: 123 },
        contract: { state, uponReceiving }
      })
    );

    const item = get('/whatever', 'PATCH');
    expect(item.urlMatcher.url).toEqual('/whatever');
    expect(item.method).toEqual('PATCH');
    expect(item.response).toEqual({
      body: { item: `whatever` },
      contentType: 'application/json',
      statusCode: 123
    });
    expect(item.contract).toEqual({ state, uponReceiving });
  });

  it('loads multiple stubs', () => {
    add(
      StubFromFile({
        requestMatcher: { url: '/some-url' },
        response: { body: `this was setup`, type: 'text' }
      })
    );
    add(
      StubFromFile({
        requestMatcher: { url: '/another' },
        response: { body: `some else`, type: 'json' }
      })
    );

    const some = get('/some-url', 'GET', undefined);
    expect(some.urlMatcher.url).toEqual('/some-url');
    expect(some.response).toEqual({
      body: `this was setup`,
      contentType: 'text/plain',
      statusCode: 200
    });
    const another = get('/another', 'GET');
    expect(another.urlMatcher.url).toEqual('/another');
    expect(another.response).toEqual({
      body: `some else`,
      contentType: 'application/json',
      statusCode: 200
    });
  });
});
