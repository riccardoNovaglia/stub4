const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

it('delays a response by the requested number of milliseconds', async () => {
  await stubFor({
    requestMatcher: {
      url: '/delayed'
    },
    response: {
      statusCode: 200,
      delay: 1000
    }
  });

  const response = await testClient.get('/delayed');

  expect(response.timeTaken).toBeGreaterThan(1000);
  expect(response.status).toEqual(200);
});

it('does not delay stubs by default', async () => {
  await stubFor({
    requestMatcher: {
      url: '/not-delayed'
    },
    response: {
      statusCode: 200
    }
  });

  const response = await testClient.get('/not-delayed');

  expect(response.timeTaken).toBeGreaterThan(0);
  expect(response.timeTaken).toBeLessThan(50); // this should comfortably be the case...
  expect(response.status).toEqual(200);
});
