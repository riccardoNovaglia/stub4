const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { request, POST } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

it('creates a new stub with url only, defaulting to GET, returns ok and no body', async () => {
  await stubFor(request('/john'), respondsWith(200));

  const stubbedResponse = await testClient.get('/john');
  expect(stubbedResponse.status).toEqual(200);
  expect(stubbedResponse.body).toEqual({});
});

it('sets up the stub with the required method', async () => {
  await stubFor(POST('/another-one'), respondsWith(200, 'json', { just: 'posted' }));

  const response = await testClient.post('/another-one');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ just: 'posted' });
});

it('sets up the stub with the required method (not with method alias)', async () => {
  await stubFor(
    request('/another-one').withMethod('POST'),
    respondsWith(200, 'json', { just: 'posted-again' })
  );

  const response = await testClient.post('/another-one');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ just: 'posted-again' });
});

it('only replies to the stub on the method setup', async () => {
  await stubFor(POST('/post-only'), respondsWith(200, 'json', { just: 'posted' }));

  const response = await testClient.get('/post-only');
  expect(response.status).toEqual(404);
});

it('matches headers on a request', async () => {
  await stubFor({
    requestMatcher: {
      url: '/with-headers',
      headers: { 'x-custom-header': 'some-value' }
    },
    response: {
      statusCode: 201,
      body: { msg: 'ok' }
    }
  });

  const withHeader = await testClient.get('/with-headers', { 'x-custom-header': 'some-value' });
  expect(withHeader.status).toEqual(201);
  expect(withHeader.body).toEqual({ msg: 'ok' });

  const withoutHeader = await testClient.get('/with-headers');
  expect(withoutHeader.status).toEqual(404);
});

it('sets up a stub with body matching', async () => {
  await stubFor(
    POST('/john').withBody({ id: '1' }),
    respondsWith(200, 'text', `hello, how's it going`)
  );

  const stubbedResponse = await testClient.post('/john', { id: '1' });
  expect(stubbedResponse.status).toEqual(200);
  expect(stubbedResponse.body).toEqual(`hello, how's it going`);

  const matchMiss = await testClient.post('/john', { id: '2' });
  expect(matchMiss.status).toEqual(404);
});
