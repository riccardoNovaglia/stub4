const request = require('supertest');
const { app } = require('../app');

describe('Configuring scenarios', () => {
  it('creates a scenario, with default response body and specific overrides', async () => {
    const setupResponse = await request(app)
      .post('/scenarios/new')
      .send({
        matching: { url: '/dude/{id}' },
        outcomes: [
          { id: 1, response: { body: { hey: 'dude number 1!' } } },
          { id: 2, response: { body: { hey: 'dude number 2!' } } },
          { id: 42, response: { body: { hey: 'the answer' } } }
        ],
        default: {
          response: { body: { hey: 'default dude!' }, statusCode: 200 }
        }
      });
    expect(setupResponse.status).toEqual(200);

    const dude1 = await request(app).get('/dude/1');
    expect(dude1.status).toEqual(200);
    expect(dude1.body).toEqual({ hey: 'dude number 1!' });

    const dude2 = await request(app).get('/dude/2');
    expect(dude2.status).toEqual(200);
    expect(dude2.body).toEqual({ hey: 'dude number 2!' });

    const dude3 = await request(app).get('/dude/3');
    expect(dude3.status).toEqual(200);
    expect(dude3.body).toEqual({ hey: 'default dude!' });

    const answer = await request(app).get('/dude/42');
    expect(answer.status).toEqual(200);
    expect(answer.body).toEqual({ hey: 'the answer' });
  });

  it('creates a scenario, with status codes', async () => {
    await request(app)
      .post('/scenarios/new')
      .send({
        matching: { url: '/statuses/{bananas}' },
        outcomes: [
          { bananas: 51, response: { body: {}, statusCode: 201 } },
          { bananas: 29, response: { body: {}, statusCode: 303 } },
          { bananas: 42, response: { body: {}, statusCode: 404 } }
        ],
        default: {
          response: { body: {}, statusCode: 200 }
        }
      });

    const statuses51 = await request(app).get('/statuses/51');
    expect(statuses51.status).toEqual(201);
    expect(statuses51.body).toEqual({});

    const statuses29 = await request(app).get('/statuses/29');
    expect(statuses29.status).toEqual(303);
    expect(statuses29.body).toEqual({});

    const answer = await request(app).get('/statuses/42');
    expect(answer.status).toEqual(404);
    expect(answer.body).toEqual({});

    const defaultResponse = await request(app).get('/statuses/123321');
    expect(defaultResponse.status).toEqual(200);
    expect(defaultResponse.body).toEqual({});
  });

  it('creates a scenario, based on a query parameter', async () => {
    await request(app)
      .post('/scenarios/new')
      .send({
        matching: { url: '/things?stuff={stuff}' },
        outcomes: [
          { stuff: 'yes', response: { body: { some: 'thing' }, statusCode: 200 } },
          { stuff: 'no', response: { body: {}, statusCode: 404 } }
        ],
        default: {
          response: { body: {}, statusCode: 404 }
        }
      });

    const yes = await request(app).get('/things?stuff=yes');
    expect(yes.status).toEqual(200);
    expect(yes.body).toEqual({ some: 'thing' });

    const no = await request(app).get('/things?stuff=no');
    expect(no.status).toEqual(404);
    expect(no.body).toEqual({});

    const other = await request(app).get('/things?stuff=other');
    expect(other.status).toEqual(404);
    expect(other.body).toEqual({});
  });

  it('creates a scenario, with multiple capturing groups', async () => {
    await request(app)
      .post('/scenarios/new')
      .send({
        matching: { url: '/many?things={things}&other-things={other-things}' },
        outcomes: [
          {
            things: 'yes',
            'other-things': 'yes',
            response: { body: { gots: 'alls' }, statusCode: 200 }
          },
          {
            things: 'yes',
            'other-things': 'no',
            response: { body: { gots: 'just some' }, statusCode: 200 }
          }
        ],
        default: {
          response: { body: { gots: 'not enough' }, statusCode: 404 }
        }
      });

    const yes = await request(app).get('/many?things=yes&other-things=yes');
    expect(yes.status).toEqual(200);
    expect(yes.body).toEqual({ gots: 'alls' });

    const some = await request(app).get('/many?things=yes&other-things=no');
    expect(some.status).toEqual(200);
    expect(some.body).toEqual({ gots: 'just some' });

    const notEnough = await request(app).get('/many?things=no&other-things=yes');
    expect(notEnough.status).toEqual(404);
    expect(notEnough.body).toEqual({ gots: 'not enough' });

    const none = await request(app).get('/many?things=no&other-things=no');
    expect(none.status).toEqual(404);
    expect(none.body).toEqual({ gots: 'not enough' });
  });
});
