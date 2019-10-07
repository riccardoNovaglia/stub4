const { clearAll, get, all } = require('../stubbing');
const loadFromFile = require('./fileLoad');

describe('Loading stubs from an initialiser file', () => {
  afterEach(clearAll);

  it('creates a stub with some response and fills all defaults', () => {
    loadFromFile([
      {
        requestMatcher: { url: '/some-url' },
        response: { body: `this was setup`, type: 'text' }
      }
    ]);

    const item = get('/some-url');
    expect(item).toEqual({
      request: { url: '/some-url', method: 'GET', contract: undefined },
      response: { body: `this was setup`, contentType: 'text/plain', statusCode: 200 }
    });
  });

  it('creates a stub with some method and contract and response type and status', () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    loadFromFile([
      {
        requestMatcher: { url: '/whatever', method: 'PATCH', contract: { state, uponReceiving } },
        response: { body: { item: `whatever` }, type: 'json', statusCode: 123 }
      }
    ]);

    const item = get('/whatever');
    expect(item).toEqual({
      request: { url: '/whatever', method: 'PATCH', contract: { state, uponReceiving } },
      response: { body: { item: `whatever` }, contentType: 'application/json', statusCode: 123 }
    });
  });

  it('loads multiple stubs', () => {
    loadFromFile([
      {
        requestMatcher: { url: '/some-url' },
        response: { body: `this was setup`, type: 'text' }
      },
      {
        requestMatcher: { url: '/another' },
        response: { body: `some else`, type: 'json' }
      }
    ]);

    const some = get('/some-url');
    expect(some).toEqual({
      request: { url: '/some-url', method: 'GET', contract: undefined },
      response: { body: `this was setup`, contentType: 'text/plain', statusCode: 200 }
    });
    const another = get('/another');
    expect(another).toEqual({
      request: { url: '/another', method: 'GET', contract: undefined },
      response: { body: `some else`, contentType: 'application/json', statusCode: 200 }
    });
  });
});
