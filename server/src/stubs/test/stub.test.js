const request = require('supertest');
const axios = require('axios');
const app = require('../../app');

const Stub4 = require('@stub4/client');
const { get, post } = require('@stub4/client');

describe('Stubbing via the client', () => {
  let server;
  const client = new Stub4.StubClient(9010);
  beforeAll(done => {
    server = app.listen(9010, done);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await axios.delete('http://localhost:9010/stubs');
  });

  it('returns 404 for not-yet-existing stubs', async () => {
    const stubbedResponse = await request(app).get('/this-dont-exist');
    expect(stubbedResponse.status).toEqual(404);
  });

  it('creates a new stub with url only, defaulting to GET, returns ok and no body', async () => {
    await client.stub(get('/john').returns('json', {}));

    const stubbedResponse = await request(app).get('/john');
    expect(stubbedResponse.status).toEqual(200);
    expect(stubbedResponse.body).toEqual({});
  });

  it('responds from the new stub with the given body', async () => {
    await client.stub(get('/whateva').returns('json', { hey: 'you!' }));

    const response = await request(app).get('/whateva');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ hey: 'you!' });
  });

  it('sets up the stub with the required method', async () => {
    await client.stub(post('/another-one').returns('json', { just: 'posted' }));

    const response = await request(app).post('/another-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ just: 'posted' });
  });

  it('sets up the stub with the required method (not with method alias)', async () => {
    await client.stub(client.request('POST', '/another-one').returns('json', { just: 'posted' }));

    const response = await request(app).post('/another-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ just: 'posted' });
  });

  it('only replies to the stub on the method setup', async () => {
    await client.stub(client.request('POST', '/post-only').returns('json', { just: 'posted' }));

    const response = await request(app).get('/post-only');
    expect(response.status).toEqual(404);
  });

  it('responds with the correct body format and header given a response type', async () => {
    await client.stub(get('/a-new-one').returns('text', `hello, how's it going`));

    const response = await request(app).get('/a-new-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual("hello, how's it going");
    expect(response.headers).toMatchObject({
      'content-type': 'text/plain; charset=utf-8'
    });
  });

  it('responds with the correct status code', async () => {
    await client.stub(get('/failure').returnsJson({}, 543));

    const response = await request(app).get('/failure');
    expect(response.statusCode).toEqual(543);
  });

  it('returns an error if the url is not specified', async () => {
    // TODO: return actual failure mgs, not just 500
    expect(client.stub(get(undefined).returnsJson({}, 543))).rejects.toThrow('500');
  });

  it('can override an existing stub with a new one', async () => {
    await client.stub(get('/to-be-overridden').returns('text', `this is the first one`));
    await client.stub(get('/to-be-overridden').returns('text', 'the new text!'));

    const response = await request(app).get('/to-be-overridden');
    expect(response.text).toEqual('the new text!');
  });

  describe('body matching', () => {
    it('sets up a stub with body matching', async () => {
      await client.stub(
        post('/john')
          .withBody({ id: '1' })
          .returns('text', `hello, how's it going`)
      );

      const stubbedResponse = await request(app)
        .post('/john')
        .send({ id: '1' });
      expect(stubbedResponse.status).toEqual(200);
      expect(stubbedResponse.body).toEqual({});

      const matchMiss = await request(app)
        .post('/john')
        .send({ id: '2' });
      expect(matchMiss.status).toEqual(404);
    });
  });
});
