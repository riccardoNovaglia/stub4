const axios = require('axios');
const { app } = require('../app');

describe('Setting up stubs', () => {
  beforeAll(done => {
    app.listen(9009, done);
  });

  afterAll(() => {
    app.close();
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
});
