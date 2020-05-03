const call = require('supertest');
const axios = require('axios');
const enableDestroy = require('server-destroy');
const app = require('../../app');

const { stubFor, setPort } = require('@stub4/client');
const { GET } = require('@stub4/client/src/RequestMatcher');
const { containsScenarios } = require('@stub4/client/src/ScenariosResponse');

describe('Delaying stubs responses', () => {
  let server;
  setPort(9021);
  beforeAll((done) => {
    server = app.listen(9021, done);
    enableDestroy(server);
  });
  afterAll(() => server.destroy());
  beforeEach(async () => await axios.delete('http://localhost:9021/scenarios'));

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

    const { response: quickResponse, timeTaken: quickTime } = await timed(() =>
      call(app).get('/timings/quick')
    );
    expect(quickTime).toBeGreaterThan(0);
    expect(quickTime).toBeLessThan(50); // this should comfortably be the case...
    expect(quickResponse.status).toEqual(200);
    expect(quickResponse.body).toEqual({ msg: 'quick' });

    const { response: slowResponse, timeTaken: slowTime } = await timed(() =>
      call(app).get('/timings/slow')
    );
    expect(slowTime).toBeGreaterThan(1000);
    expect(slowResponse.status).toEqual(200);
    expect(slowResponse.body).toEqual({ msg: 'slow' });
  });
});

async function timed(fn) {
  const before = new Date();
  const response = await fn();
  const after = new Date();
  const diff = after.getTime() - before.getTime();

  return { response, timeTaken: diff };
}
