const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { GET } = require('@stub4/client/src/RequestMatcher');
const { proxyTo } = require('@stub4/client/src/Proxy');
const { respondsWith } = require('@stub4/client/src/StubResponse');

describe('Setting up a proxy with delay', () => {
  const testClient = TestClient();
  beforeAll(() => setup(stub4, setPort, testClient));
  afterEach(() => stub4.clearAll());
  afterAll(() => stub4.shutdown());

  it('proxies requests to other endpoint, and adds a delay to the response', async () => {
    const stub4Host = `http://localhost:${stub4.listeningPort()}`;
    await stubFor(GET('/bananas'), respondsWith(200, 'text', 'it worked!'));
    await stubFor(GET('/john'), proxyTo(`${stub4Host}/bananas`).delayedBy(500));

    const response = await testClient.get('/john');
    expect(response.timeTaken).toBeGreaterThan(500);
    expect(response.timeTaken).toBeLessThan(550);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('it worked!');
  });
});
