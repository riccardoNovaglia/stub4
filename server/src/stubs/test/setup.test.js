const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort, stubs } = require('@stub4/client');
const { GET } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

jest.mock('uuid', () => ({
  v4: () => 'some-id'
}));

describe('Stub creation basics', () => {
  const testClient = TestClient();
  beforeAll(() => setup(stub4, setPort, testClient));
  afterEach(() => stub4.clearAll());
  afterAll(() => stub4.shutdown());

  it('returns an error if the url is not specified', async () => {
    // TODO: return actual failure mgs, not just 500
    // tbf the client should probably reject it itself?
    await expect(stubFor(GET(undefined), respondsWith(200))).rejects.toThrow('500');
  });

  it('returns the created item on creation', async () => {
    const response = await stubFor(GET('/some-stub'), respondsWith(200));
    expect(response).toEqual({
      id: 'some-id',
      enabled: true,
      requestMatcher: { url: '/some-stub', method: 'GET' },
      response: { body: {}, contentType: 'application/json', statusCode: 200 }
    });
  });

  it('allows deleting an item by id', async () => {
    const stub = await stubFor(GET('/some-stub'), respondsWith(200));
    await testClient.delete(`/stubs/${stub.id}`);
    const response = await testClient.get('/some-stub');
    expect(response.status).toEqual(404);
  });

  // TODO: maybe this should go?
  it('can override an existing stub with a new one', async () => {
    await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'this is the first one'));
    await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'the new text!'));

    const response = await testClient.get('/to-be-overridden');
    expect(response.body).toEqual('the new text!');
  });

  it('can override an existing stub with a new one posting with id', async () => {
    const stub = await stubFor(
      GET('/to-be-overridden'),
      respondsWith(200, 'text', 'this is the first one')
    );
    await stubFor({
      ...stub,
      response: { body: 'something else!' }
    });

    const response = await testClient.get('/to-be-overridden');
    expect(response.body).toEqual('something else!');
  });

  it('can enable and disable a stub by id', async () => {
    const stub = await stubFor(GET('/some-stub'), respondsWith(200));
    const res = await testClient.get('/some-stub');
    expect(res.status).toEqual(200);

    await stubs.setEnabled(stub, false);
    const res2 = await testClient.get('/some-stub');
    expect(res2.status).toEqual(404);

    await stubs.setEnabled(stub, true);
    const res3 = await testClient.get('/some-stub');
    expect(res3.status).toEqual(200);
  });
});
