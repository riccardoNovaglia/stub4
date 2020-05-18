const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { request, GET } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

it('responds from the new stub with the given body', async () => {
  await stubFor(request('/whateva'), respondsWith(200, 'json', { hey: 'you!' }));

  const response = await testClient.get('/whateva');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ hey: 'you!' });
});

it('responds with the correct body format and header given a response type', async () => {
  await stubFor(GET('/a-new-one'), respondsWith(200, 'text', `hello, how's it going`));

  const response = await testClient.get('/a-new-one');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual("hello, how's it going");
  expect(response.headers).toMatchObject({
    'content-type': 'text/plain; charset=utf-8'
  });
});

it('responds with the correct status code', async () => {
  await stubFor(GET('/failure'), respondsWith(543));

  const response = await testClient.get('/failure');
  expect(response.status).toEqual(543);
});

it('can override an existing stub with a new one', async () => {
  await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'this is the first one'));
  await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'the new text!'));

  const response = await testClient.get('/to-be-overridden');
  expect(response.body).toEqual('the new text!');
});
