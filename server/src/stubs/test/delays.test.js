const call = require('supertest');
const axios = require('axios');
const enableDestroy = require('server-destroy');
const app = require('../../app');

const { stubFor, setPort } = require('@stub4/client');

describe('Delaying stubs responses', () => {
  let server;
  setPort(9020);
  beforeAll((done) => {
    server = app.listen(9020, done);
    enableDestroy(server);
  });
  afterAll(() => server.destroy());
  beforeEach(async () => await axios.delete('http://localhost:9020/stubs'));

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

    const before = new Date();
    const response = await call(app).get('/delayed');
    const after = new Date();
    const millisDiff = after.getTime() - before.getTime();
    expect(millisDiff).toBeGreaterThan(1000);

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

    const before = new Date();
    const response = await call(app).get('/not-delayed');
    const after = new Date();
    const millisDiff = after.getTime() - before.getTime();
    expect(millisDiff).toBeGreaterThan(0);
    expect(millisDiff).toBeLessThan(50); // this should comfortably be the case...
    expect(response.status).toEqual(200);
  });
});
