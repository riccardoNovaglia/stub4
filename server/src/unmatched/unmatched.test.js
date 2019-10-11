const request = require('supertest');
const { app } = require('../app');

describe('Saving and returning unmatched interactions', () => {
  afterEach(async () => {
    await request(app).delete('/unmatched');
  });

  it('returns 404 for not-yet-existing stubs, returns the request url under unmatched', async () => {
    const stubbedResponse = await request(app).get('/this-dont-exist');
    expect(stubbedResponse.status).toEqual(404);

    const unmatched = await request(app).get('/unmatched');
    expect(unmatched.status).toEqual(200);
    expect(unmatched.body[0].url).toEqual('/this-dont-exist');
    expect(unmatched.body[0].called).toEqual(1);
  });

  it('also saves the method of the call', async () => {
    await request(app).get('/this-dont-exist');
    await request(app).post('/this-also-dont-exist');

    const unmatched = await request(app).get('/unmatched');
    expect(unmatched.status).toEqual(200);
    expect(unmatched.body).toEqual([
      { url: '/this-dont-exist', method: 'GET', called: 1 },
      { url: '/this-also-dont-exist', method: 'POST', called: 1 }
    ]);
  });

  it('clears unmatched on request', async () => {
    await request(app).get('/this-dont-exist');

    const remove = await request(app).delete('/unmatched');
    expect(remove.status).toEqual(200);

    await request(app).get('/this-dont-exist');
    const unmatched = await request(app).get('/unmatched');
    expect(unmatched.body[0].url).toEqual('/this-dont-exist');
    expect(unmatched.body[0].called).toEqual(1);
  });

  it('returns the request url under unmatched', async () => {
    await request(app).get('/this-dont-exist');
    await request(app).get('/another');
    await request(app).get('/other');

    const unmatched = await request(app).get('/unmatched');
    expect(unmatched.body).toEqual([
      { url: '/this-dont-exist', method: 'GET', called: 1 },
      { url: '/another', method: 'GET', called: 1 },
      { url: '/other', method: 'GET', called: 1 }
    ]);
  });

  it('returns the request under unmatched, consolidating + counting similar requests', async () => {
    await request(app).get('/this-dont-exist');
    await request(app).get('/another');
    await request(app).get('/other');
    await request(app).get('/this-dont-exist');

    const unmatched = await request(app).get('/unmatched');
    expect(unmatched.body).toEqual([
      { url: '/this-dont-exist', method: 'GET', called: 2 },
      { url: '/another', method: 'GET', called: 1 },
      { url: '/other', method: 'GET', called: 1 }
    ]);
  });
});
