const { clear, get, add } = require('../Stubs');
const { StubFromFile } = require('../Stub');

jest.mock('uuid', () => ({
  v4: () => 'some-id'
}));

describe('Loading stubs from an initialiser file', () => {
  afterEach(clear);

  it('creates a stub with some response and fills all defaults', () => {
    add(
      StubFromFile({
        requestMatcher: { url: '/some-url', method: 'GET' },
        response: { body: `this was setup`, type: 'text' }
      })
    );

    const item = get('/some-url', 'GET', undefined);
    const { id, requestMatcher, response } = item.toJson();
    expect(id).toEqual('some-id');
    expect(requestMatcher.url).toEqual('/some-url');
    expect(requestMatcher.method).toEqual('GET');
    expect(response.toJson()).toEqual({
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
    const { requestMatcher, response } = item.toJson();
    expect(requestMatcher.url).toEqual('/whatever');
    expect(requestMatcher.method).toEqual('PATCH');
    expect(response.toJson()).toEqual({
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
        id: 'this-one-is-not-random',
        requestMatcher: { url: '/another' },
        response: { body: `some else`, type: 'json' }
      })
    );

    const some = get('/some-url', 'GET', undefined);
    expect(some.requestMatcher.toJson().url).toEqual('/some-url');
    expect(some.response.toJson()).toEqual({
      body: `this was setup`,
      contentType: 'text/plain',
      statusCode: 200
    });
    const another = get('/another', 'GET');
    expect(another.id).toEqual('this-one-is-not-random');
    expect(another.requestMatcher.toJson().url).toEqual('/another');
    expect(another.response.toJson()).toEqual({
      body: `some else`,
      contentType: 'application/json',
      statusCode: 200
    });
  });
});
