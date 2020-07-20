const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { GET, POST } = require('@stub4/client/src/RequestMatcher');
const { proxyTo } = require('@stub4/client/src/Proxy');
const { respondsWith } = require('@stub4/client/src/StubResponse');

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());
const stub4Host = () => `http://localhost:${stub4.listeningPort()}`;

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
