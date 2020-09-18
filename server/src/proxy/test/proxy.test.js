const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { GET, POST } = require('@stub4/client/src/RequestMatcher');
const { proxyTo } = require('@stub4/client/src/Proxy');
const { respondsWith } = require('@stub4/client/src/StubResponse');

jest.mock('uuid', () => ({
  v4: () => 'some-id'
}));

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());
const stub4Host = () => `http://localhost:${stub4.listeningPort()}`;

describe('basic setup', () => {
  it('returns the built proxy on creation', async () => {
    const proxy = await stubFor(POST('/john'), proxyTo(`${stub4Host()}/bananas`));
    expect(proxy).toEqual({
      id: 'some-id',
      requestMatcher: { url: '/john', method: 'POST' },
      proxy: { destinationUrl: `${stub4Host()}/bananas` }
    });
  });

  it('returns the build proxy when queried by id', async () => {
    const proxy = await stubFor(POST('/stuff'), proxyTo(`/things`));
    const gotProxy = await testClient.get(`/proxy/${proxy.id}`);
    expect(gotProxy.data).toEqual({
      id: 'some-id',
      requestMatcher: { url: '/stuff', method: 'POST' },
      proxy: { destinationUrl: `/things` }
    });
    expect(gotProxy.data).toEqual(proxy);
  });

  it('updates the proxy when posted with id', async () => {
    const proxy = await stubFor(POST('/john'), proxyTo(`${stub4Host()}/bananas`));
    const updated = await stubFor({
      ...proxy,
      proxy: { destinationUrl: 'http://another/destination' }
    });
    const returnedById = await testClient.get(`/proxy/${proxy.id}`);
    expect(updated).toEqual({
      id: 'some-id',
      requestMatcher: { url: '/john', method: 'POST' },
      proxy: { destinationUrl: 'http://another/destination' }
    });
    expect(returnedById.data).toEqual(updated);
  });

  it('deletes the proxy by id', async () => {
    await stubFor(GET('/bananas'), respondsWith(200, 'text', 'it worked!'));
    const proxy = await stubFor(GET('/john'), proxyTo(`${stub4Host()}/bananas`));
    await testClient.delete(`/proxy/${proxy.id}`);
    const proxiedResponse = await testClient.get('/john');
    expect(proxiedResponse.status).toEqual(404);
  });
});

it('proxies requests to other endpoints, within the same app', async () => {
  await stubFor(GET('/bananas'), respondsWith(200, 'text', 'it worked!'));

  await stubFor(GET('/john'), proxyTo(`${stub4Host()}/bananas`));

  const proxiedResponse = await testClient.get('/john');
  expect(proxiedResponse.status).toEqual(200);
  expect(proxiedResponse.data).toEqual('it worked!');
});

it('proxies requests to other endpoints, with the right method', async () => {
  await stubFor(POST('/stuff'), respondsWith(200, 'text', 'it worked!'));

  await stubFor(POST('/things'), proxyTo(`${stub4Host()}/stuff`));

  const proxiedResponse = await testClient.post('/things');
  expect(proxiedResponse.status).toEqual(200);
  expect(proxiedResponse.data).toEqual('it worked!');
});

it('returns all created proxies', async () => {
  await stubFor(POST('/john'), proxyTo(`${stub4Host()}/bananas`));

  const proxiedResponse = await testClient.get('/proxy');
  expect(proxiedResponse.status).toEqual(200);
  expect(proxiedResponse.data).toEqual([
    {
      id: 'some-id',
      requestMatcher: { url: '/john', method: 'POST' },
      proxy: { destinationUrl: `${stub4Host()}/bananas` }
    }
  ]);
});

it('proxies over the body and content type of (POST) requests', async () => {
  await stubFor(
    POST('/post-and-body').withBody({ id: '123' }).withType('json'),
    respondsWith(200, 'text', 'it worked!')
  );

  await stubFor(POST('/to-be-proxied'), proxyTo(`${stub4Host()}/post-and-body`));

  const proxiedResponse = await testClient.post('/to-be-proxied', { id: '123' });
  expect(proxiedResponse.status).toEqual(200);
  expect(proxiedResponse.data).toEqual('it worked!');

  const wrongMethod = await testClient.get('/to-be-proxied');
  expect(wrongMethod.status).toEqual(404);

  const wrongBody = await testClient.post('/to-be-proxied', { id: '321' });
  expect(wrongBody.status).toEqual(404);
});

it('proxies over the body and content type of (POST) requests (xml)', async () => {
  await stubFor(
    POST('/post-and-body')
      .withBody([{ path: 'string(//title)', value: 'Harry Potter' }])
      .withType('xml'),
    respondsWith(200, 'text', 'it worked!')
  );

  await stubFor(POST('/to-be-proxied'), proxyTo(`${stub4Host()}/post-and-body`));
  const proxiedResponse = await testClient.post(
    '/to-be-proxied',
    "<book author='J. K. Rowling'><title>Harry Potter</title></book>",
    { 'Content-Type': 'text/xml' }
  );
  expect(proxiedResponse.status).toEqual(200);
  expect(proxiedResponse.data).toEqual('it worked!');

  const wrongBody = await testClient.post(
    '/to-be-proxied',
    "<book author='J. K. Rowling'><title>Jerry Potter</title></book>"
  );
  expect(wrongBody.status).toEqual(404);
});
