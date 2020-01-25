const request = require('supertest');
const axios = require('axios');
const app = require('../../app');

const Stub4 = require('@stub4/client');
const { get, post } = require('@stub4/client');

describe('Stubbing via the client', () => {
  let server;
  const client = new Stub4.StubClient(9018);
  beforeAll(done => {
    server = app.listen(9018, done);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await axios.delete('http://localhost:9018/stubs');
  });

  it('responds from the new stub with the given body', async () => {
    await client.stub(get('/whateva').returns('xml', '<xml></xml>'));

    const response = await request(app).get('/whateva');
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('<xml></xml>');
  });

  it('responds with the correct body format and header given a response type', async () => {
    await client.stub(get('/a-new-one').returns('xml', '<xml></xml>'));

    const response = await request(app).get('/a-new-one');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('<xml></xml>');
    expect(response.headers).toMatchObject({
      'content-type': 'application/xml; charset=utf-8'
    });
  });

  describe('body matching', () => {
    it('sets up a stub with xml body matching', async () => {
      await client.stub(
        post('/books')
          .withXmlBodyMatch([{ path: 'string(//title)', value: 'Harry Potter' }])
          .returns('xml', `<msg>yer a wizard</msg>`)
      );

      const stubbedResponse = await request(app)
        .post('/books')
        .type('xml')
        .send("<book author='J. K. Rowling'><title>Harry Potter</title></book>");
      expect(stubbedResponse.status).toEqual(200);
      expect(stubbedResponse.body).toEqual({});

      const matchMiss = await request(app)
        .post('/books')
        .set('Content-Type', 'text/xml')
        .send("<book author='J. K. Rowling'><title>Jerry Potter</title></book>");
      expect(matchMiss.status).toEqual(404);
    });

    it('multiple value match', async () => {
      await client.stub(
        post('/books')
          .withXmlBodyMatch([
            { path: 'string(//title)', value: 'Harry Potter' },
            { path: 'string(/book/@author)', value: 'J. K. Rowling' }
          ])
          .returns('xml', `<msg>yer a wizard</msg>`)
      );

      const stubbedResponse = await request(app)
        .post('/books')
        .type('xml')
        .send("<book author='J. K. Rowling'><title>Harry Potter</title></book>");
      expect(stubbedResponse.status).toEqual(200);
      expect(stubbedResponse.body).toEqual({});

      const titleMiss = await request(app)
        .post('/books')
        .set('Content-Type', 'text/xml')
        .send("<book author='J. K. Rowling'><title>Jerry Potter</title></book>");
      expect(titleMiss.status).toEqual(404);

      const authorMiss = await request(app)
        .post('/books')
        .set('Content-Type', 'text/xml')
        .send("<book author='J. J. Rowling'><title>Harry Potter</title></book>");
      expect(authorMiss.status).toEqual(404);
    });
  });
});
