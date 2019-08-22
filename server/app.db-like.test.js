const request = require('supertest');
const app = require('./app');

describe('Create db-like endpoints', () => {
  it('exists', async () => {
    const response = await request(app)
      .post('/new-db')
      .send({ url: '/some-url' });
    expect(response.status).toEqual(200);
  });

  it('404s when nothing is in it', async () => {
    await request(app)
      .post('/new-db')
      .send({ url: '/some-url' });

    const response = await request(app).get('/some-url');
    expect(response.status).toEqual(404);
  });
});
