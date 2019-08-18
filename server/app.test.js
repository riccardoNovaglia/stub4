const request = require('supertest');
const app = require('./app');

describe('Setting up stubs', () => {
  it('creates a new stub with url only, defaulting to GET, returns ok and no body', async () => {
    const stubCreationResponse = await request(app)
      .post('/new-stub')
      .send({ requestMatcher: { url: '/john' } });
    expect(stubCreationResponse.status).toEqual(200);

    const stubbedResponse = await request(app).get('/john');
    expect(stubbedResponse.status).toEqual(200);
    expect(stubbedResponse.body).toEqual({});
  });

  it('responds from the new stub with the given body', async () => {
    await request(app)
      .post('/new-stub')
      .send({
        requestMatcher: { url: '/whateva' },
        response: { body: { hey: 'you!' } }
      });

    const response = await request(app).get('/whateva');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ hey: 'you!' });
  });

  it('sets up the stub with the required method', async () => {
    await request(app)
      .post('/new-stub')
      .send({
        requestMatcher: { method: 'POST', url: '/another-one' },
        response: { body: { just: 'posted' } }
      });

    const response = await request(app).post('/another-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ just: 'posted' });
  });

  it('responds with the correct body format and header given a response type', async () => {
    await request(app)
      .post('/new-stub')
      .send({
        requestMatcher: { url: '/a-new-one' },
        response: { body: `hello, how's it going`, type: 'text' }
      });

    const response = await request(app).get('/a-new-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual("hello, how's it going");
    expect(response.headers).toMatchObject({
      'content-type': 'text/plain; charset=utf-8'
    });
  });

  it('returns an error if the url is not specified', async () => {
    const stubCreationResponse = await request(app)
      .post('/new-stub')
      .send({ requestMatcher: {} });
    expect(stubCreationResponse.status).toEqual(500);
    expect(stubCreationResponse.body).toEqual({
      error: 'A request matcher url must be provided!'
    });
  });

  it('can override an existing stub with a new one', async () => {
    await request(app)
      .post('/new-stub')
      .send({
        requestMatcher: { url: '/to-be-overridden' },
        response: { body: `this is the first one`, type: 'text' }
      });
    await request(app)
      .post('/new-stub')
      .send({
        requestMatcher: { url: '/to-be-overridden' },
        response: { body: 'the new text!', type: 'text' }
      });

    const response = await request(app).get('/to-be-overridden');
    expect(response.text).toEqual('the new text!');
  });
});
