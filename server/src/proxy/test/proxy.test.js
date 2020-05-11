const axios = require('axios');
const enableDestroy = require('server-destroy');
const app = require('../../app');

const { stubFor, setPort } = require('@stub4/client');
const { GET, POST } = require('@stub4/client/src/RequestMatcher');
const { proxyTo } = require('@stub4/client/src/Proxy');
const { respondsWith } = require('@stub4/client/src/StubResponse');

describe('Setting up stubs', () => {
  let server;
  setPort(9009);
  beforeAll((done) => {
    server = app.listen(9009, done);
    enableDestroy(server);
  });
  afterAll(() => server.destroy());
  afterEach(async () => await axios.delete('http://localhost:9009/proxy'));

  it('proxies requests to other endpoints, within the same app', async () => {
    await stubFor(GET('/bananas'), respondsWith(200, 'text', 'it worked!'));

    await stubFor(GET('/john'), proxyTo('http://localhost:9009/bananas'));

    const proxiedResponse = await axios.get('http://localhost:9009/john');
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual('it worked!');
  });

  it('proxies requests to other endpoints, with the right method', async () => {
    await stubFor(POST('/stuff'), respondsWith(200, 'text', 'it worked!'));

    await stubFor(POST('/things'), proxyTo('http://localhost:9009/stuff'));

    const proxiedResponse = await axios.post('http://localhost:9009/things');
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual('it worked!');
  });

  it('returns all created proxies', async () => {
    await stubFor(POST('/john'), proxyTo('http://localhost:9009/bananas'));

    const proxiedResponse = await axios.get('http://localhost:9009/proxy');
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual([
      {
        requestMatcher: { urlMatcher: { url: '/john' }, method: 'POST' },
        proxyUrl: 'http://localhost:9009/bananas'
      }
    ]);
  });

  it.only('proxies over the body and content type of (POST) requests', async () => {
    await stubFor(
      POST('/post-and-body').withBody({ id: '123' }).withType('json'),
      respondsWith(200, 'text', 'it worked!')
    );

    await stubFor(POST('/to-be-proxied'), proxyTo('http://localhost:9009/post-and-body'));
    const proxiedResponse = await axios.request({
      url: 'http://localhost:9009/to-be-proxied',
      method: 'POST',
      data: { id: '123' }
    });
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual('it worked!');

    await failsWithStatusCode(404, () =>
      axios.request({
        url: 'http://localhost:9009/to-be-proxied',
        method: 'GET',
        data: { id: '123' }
      })
    );

    await failsWithStatusCode(404, () =>
      axios.request({
        url: 'http://localhost:9009/to-be-proxied',
        method: 'POST',
        data: { id: '321' }
      })
    );
  });

  it('proxies over the body and content type of (POST) requests (xml)', async () => {
    await stubFor(
      POST('/post-and-body')
        .withBody([{ path: 'string(//title)', value: 'Harry Potter' }])
        .withType('xml'),
      respondsWith(200, 'text', 'it worked!')
    );

    await stubFor(POST('/to-be-proxied'), proxyTo('http://localhost:9009/post-and-body'));
    const proxiedResponse = await axios.post(
      'http://localhost:9009/to-be-proxied',
      "<book author='J. K. Rowling'><title>Harry Potter</title></book>",
      {
        headers: { 'Content-Type': 'text/xml' }
      }
    );
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual('it worked!');

    await failsWithStatusCode(404, () =>
      axios.post(
        'http://localhost:9009/to-be-proxied',
        "<book author='J. K. Rowling'><title>Jerry Potter</title></book>",
        {
          headers: { 'Content-Type': 'text/xml' }
        }
      )
    );
  });
});

async function failsWithStatusCode(statusCode, callFn) {
  try {
    await callFn();
  } catch (error) {
    expect(error.response.status).toEqual(statusCode);
  }
}
