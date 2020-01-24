const call = require('supertest');
const axios = require('axios');
const app = require('../../app');

const { stubFor, setPort } = require('@stub4/client');
const { request, GET, POST } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

describe('Stubbing via the client, 2.0', () => {
  let server;
  setPort(9010);
  beforeAll(done => {
    server = app.listen(9010, done);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await axios.delete('http://localhost:9010/stubs');
  });

  it('creates a new stub with url only, defaulting to GET, returns ok and no body', async () => {
    await stubFor(request('/john'), respondsWith(200));

    const stubbedResponse = await call(app).get('/john');
    expect(stubbedResponse.status).toEqual(200);
    expect(stubbedResponse.body).toEqual({});
  });

  it('responds from the new stub with the given body', async () => {
    await stubFor(request('/whateva'), respondsWith(200, 'json', { hey: 'you!' }));

    const response = await call(app).get('/whateva');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ hey: 'you!' });
  });

  it('sets up the stub with the required method', async () => {
    await stubFor(POST('/another-one'), respondsWith(200, 'json', { just: 'posted' }));

    const response = await call(app).post('/another-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ just: 'posted' });
  });

  it('sets up the stub with the required method (not with method alias)', async () => {
    await stubFor(
      request('/another-one').withMethod('POST'),
      respondsWith(200, 'json', { just: 'posted-again' })
    );

    const response = await call(app).post('/another-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ just: 'posted-again' });
  });

  it('only replies to the stub on the method setup', async () => {
    await stubFor(POST('/post-only'), respondsWith(200, 'json', { just: 'posted' }));

    const response = await call(app).get('/post-only');
    expect(response.status).toEqual(404);
  });

  it('responds with the correct body format and header given a response type', async () => {
    await stubFor(GET('/a-new-one'), respondsWith(200, 'text', `hello, how's it going`));

    const response = await call(app).get('/a-new-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual("hello, how's it going");
    expect(response.headers).toMatchObject({
      'content-type': 'text/plain; charset=utf-8'
    });
  });

  it('responds with the correct status code', async () => {
    await stubFor(GET('/failure'), respondsWith(543));

    const response = await call(app).get('/failure');
    expect(response.statusCode).toEqual(543);
  });

  it('returns an error if the url is not specified', async () => {
    // TODO: return actual failure mgs, not just 500
    // tbf the client should probably reject it itself?
    expect(stubFor(GET(undefined), respondsWith(200))).rejects.toThrow('500');
  });

  it('can override an existing stub with a new one', async () => {
    await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'this is the first one'));
    await stubFor(GET('/to-be-overridden'), respondsWith(200, 'text', 'the new text!'));

    const response = await call(app).get('/to-be-overridden');
    expect(response.text).toEqual('the new text!');
  });

  describe('body matching', () => {
    it('sets up a stub with body matching', async () => {
      await stubFor(
        POST('/john').withBody({ id: '1' }),
        respondsWith(200, 'text', `hello, how's it going`)
      );

      const stubbedResponse = await call(app)
        .post('/john')
        .send({ id: '1' });
      expect(stubbedResponse.status).toEqual(200);
      expect(stubbedResponse.body).toEqual({});

      const matchMiss = await call(app)
        .post('/john')
        .send({ id: '2' });
      expect(matchMiss.status).toEqual(404);
    });
  });
});
