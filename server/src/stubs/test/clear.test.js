const request = require('supertest');
const { app } = require('../../app');

describe('Clearing and listing stubs', () => {
  it('clears setup stubs on demand', async () => {
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/stuff' },
        response: { body: `bods`, type: 'text' }
      });

    const clearResponse = await request(app).delete('/stubs');
    expect(clearResponse.status).toEqual(200);

    const stubsResponse = await request(app).get('/stubs');
    expect(stubsResponse.status).toEqual(200);
    expect(stubsResponse.body).toEqual([]);
  });

  it('returns the list of all setup stubs', async () => {
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/tubs' },
        response: { body: `bods`, type: 'text' }
      });

    const response = await request(app).get('/stubs');
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].requestMatcher.url).toEqual('/tubs');
    expect(response.body[0].response).toEqual({
      body: 'bods',
      contentType: 'text/plain',
      statusCode: 200
    });
  });
});
