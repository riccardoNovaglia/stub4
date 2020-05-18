const stub4 = require('../index');

const { stubFor, setPort } = require('@stub4/client');
const { request } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

const { TestClient } = require('./TestClient');

const testClient = TestClient();
beforeAll(() => {
  const { listeningPort } = stub4.startup();
  setPort(listeningPort);
  testClient.setPort(listeningPort);
});

afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

it('wraps axios calls to the right port', async () => {
  await stubFor(request('/whateva'), respondsWith(200, 'json', { hey: 'you!' }));

  const response = await testClient.get('/whateva');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ hey: 'you!' });
});

it('deals with 404s', async () => {
  const response = await testClient.get('/whateva');
  expect(response.status).toEqual(404);
});

it('deals with 500s', async () => {
  await stubFor(request('/whateva'), respondsWith(500, 'json', { hey: 'you!' }));

  const response = await testClient.get('/whateva');
  expect(response.status).toEqual(500);
});

it('adds response times to the response', async () => {
  await stubFor({
    requestMatcher: {
      url: '/delayed'
    },
    response: {
      statusCode: 200,
      delay: 100
    }
  });

  const { status, timeTaken } = await testClient.get('/delayed');

  expect(timeTaken).toBeGreaterThan(100);
  expect(status).toEqual(200);
});
