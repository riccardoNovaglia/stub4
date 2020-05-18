const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');
const { stubFor, setPort } = require('@stub4/client');
const { GET } = require('@stub4/client/src/RequestMatcher');
const { containsScenarios } = require('@stub4/client/src/ScenariosResponse');

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

it('delays a response by the requested number of milliseconds', async () => {
  await stubFor(
    GET('/timings/{id}'),
    containsScenarios(
      [
        { match: { id: 'quick' }, response: { body: { msg: 'quick' } } },
        { match: { id: 'slow' }, response: { body: { msg: 'slow' }, delay: 1000 } }
      ],
      {
        response: { body: { msg: 'quick' } }
      }
    )
  );

  const quickResponse = await testClient.get('/timings/quick');
  expect(quickResponse.timeTaken).toBeGreaterThan(0);
  expect(quickResponse.timeTaken).toBeLessThan(50); // this should comfortably be the case...
  expect(quickResponse.status).toEqual(200);
  expect(quickResponse.body).toEqual({ msg: 'quick' });

  const slowResponse = await testClient.get('/timings/slow');
  expect(slowResponse.timeTaken).toBeGreaterThan(1000);
  expect(slowResponse.status).toEqual(200);
  expect(slowResponse.body).toEqual({ msg: 'slow' });
});

it('delays the default response', async () => {
  await stubFor(
    GET('/timings/{id}'),
    containsScenarios([], {
      response: { body: { msg: 'not-so-slow' }, delay: 500 }
    })
  );

  const response = await testClient.get('/timings/any');
  expect(response.timeTaken).toBeGreaterThan(500);
  expect(response.timeTaken).toBeLessThan(550);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ msg: 'not-so-slow' });
});
