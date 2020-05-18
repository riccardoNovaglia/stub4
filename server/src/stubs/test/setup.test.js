const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { GET } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

describe('Response definitions', () => {
  const testClient = TestClient();
  beforeAll(() => setup(stub4, setPort, testClient));
  afterEach(() => stub4.clearAll());
  afterAll(() => stub4.shutdown());

  it('returns an error if the url is not specified', async () => {
    // TODO: return actual failure mgs, not just 500
    // tbf the client should probably reject it itself?
    await expect(stubFor(GET(undefined), respondsWith(200))).rejects.toThrow('500');
  });

  it('can override an existing stub with a new one', async () => {
    await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'this is the first one'));
    await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'the new text!'));

    const response = await testClient.get('/to-be-overridden');
    expect(response.body).toEqual('the new text!');
  });
});
