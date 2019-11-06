const request = require('supertest');
const app = require('../../app');

describe('Counting interactions', () => {
  beforeEach(async () => {
    await request(app)
      .post('/stubs')
      .send({ requestMatcher: { url: '/counted' } });

    afterEach(async () => {
      await request(app).delete('/stubs');
    });
  });

  it('returns 0 for non-called stubs', async () => {
    const response = await request(app)
      .get('/stubs/count')
      .send({ url: '/counted' });

    expect(response.status).toEqual(200);
    expect(response.body.count).toEqual(0);
  });

  it('returns a count once the stub is called', async () => {
    await request(app).get('/counted');

    const response = await request(app)
      .get('/stubs/count')
      .send({ url: '/counted' });

    expect(response.status).toEqual(200);
    expect(response.body.count).toEqual(1);
  });

  it('returns a count once the stub is called - trying out a few', async () => {
    await request(app).get('/counted');
    await request(app).get('/counted');
    await request(app).get('/counted');
    await request(app).get('/counted');

    const response = await request(app)
      .get('/stubs/count')
      .send({ url: '/counted' });

    expect(response.body.count).toEqual(4);
  });

  it('clears back to 0 when clearing out stubs, and then counts up again', async () => {
    await request(app).get('/counted');
    await request(app)
      .get('/stubs/count')
      .send({ url: '/counted' });

    await request(app).delete('/stubs');

    await request(app)
      .post('/stubs')
      .send({ requestMatcher: { url: '/counted' } });
    await request(app).get('/counted');
    const response = await request(app)
      .get('/stubs/count')
      .send({ url: '/counted' });

    expect(response.body.count).toEqual(1);
  });
});
