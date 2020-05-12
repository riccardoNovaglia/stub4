const axios = require('axios');
const enableDestroy = require('server-destroy');
const app = require('../../app');

const { stubFor, setPort } = require('@stub4/client');
const { GET, POST } = require('@stub4/client/src/RequestMatcher');
const { proxyTo } = require('@stub4/client/src/Proxy');
const { respondsWith } = require('@stub4/client/src/StubResponse');

describe('Setting up a proxy with delay', () => {
  let server;
  setPort(9029);
  beforeAll((done) => {
    server = app.listen(9029, done);
    enableDestroy(server);
  });
  afterAll(() => server.destroy());
  afterEach(async () => await axios.delete('http://localhost:9029/proxy'));

  it('proxies requests to other endpoint, and adds a delay to the response', async () => {
    await stubFor(GET('/bananas'), respondsWith(200, 'text', 'it worked!'));

    await stubFor(GET('/john'), proxyTo('http://localhost:9029/bananas').delayedBy(500));

    const { response, timeTaken } = await timed(() => axios.get('http://localhost:9029/john'));
    expect(timeTaken).toBeGreaterThan(500);
    expect(timeTaken).toBeLessThan(550);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('it worked!');
  });
});

async function timed(fn) {
  const before = new Date();
  const response = await fn();
  const after = new Date();
  const diff = after.getTime() - before.getTime();

  return { response, timeTaken: diff };
}
