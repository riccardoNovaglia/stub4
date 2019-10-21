const axios = require('axios');
const app = require('../app');

describe('Setting up stubs', () => {
  let server;
  beforeAll(done => {
    server = app.listen(9009, done);
  });

  afterAll(() => {
    server.close();
  });

  afterEach(async () => {
    await axios.delete('http://localhost:9009/proxy');
  });

  it('proxies requests to other endpoints, within the same app', async () => {
    await axios.post('http://localhost:9009/stubs/new', {
      requestMatcher: { url: '/bananas' },
      response: { body: 'it worked!', type: 'text' }
    });

    const proxyCreationResponse = await axios.post('http://localhost:9009/proxy/new', {
      requestMatcher: { url: '/john' },
      proxy: { destination: { url: 'http://localhost:9009/bananas' } }
    });
    expect(proxyCreationResponse.status).toEqual(200);

    const proxiedResponse = await axios.get('http://localhost:9009/john');
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual('it worked!');
  });

  it('returns all created proxies', async () => {
    await axios.post('http://localhost:9009/proxy/new', {
      requestMatcher: { url: '/john' },
      proxy: { destination: { url: 'http://localhost:9009/bananas' } }
    });

    const proxiedResponse = await axios.get('http://localhost:9009/proxy');
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual([
      {
        request: { url: '/john', method: 'GET' },
        proxyUrl: 'http://localhost:9009/bananas'
      }
    ]);
  });
});
