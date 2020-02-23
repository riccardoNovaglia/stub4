const call = require('supertest');
const axios = require('axios');
const enableDestroy = require('server-destroy');

const app = require('../../app');

const { stubFor, setPort } = require('@stub4/client');
const { GET, POST } = require('@stub4/client/src/RequestMatcher');
const { containsScenarios } = require('@stub4/client/src/ScenariosResponse');

describe('Configuring scenarios', () => {
  let server;
  setPort(9019);
  beforeAll(done => {
    server = app.listen(9019, done);
    enableDestroy(server);
  });
  afterAll(() => server.destroy());
  beforeEach(async () => await axios.delete('http://localhost:9019/scenarios'));

  describe('url matching', () => {
    it('creates a scenario, with default response body and specific overrides', async () => {
      await stubFor(
        GET('/dude/{id}'),
        containsScenarios(
          [
            { match: { id: 1 }, response: { body: { hey: 'dude number 1!' } } },
            { match: { id: 2 }, response: { body: { hey: 'dude number 2!' } } },
            { match: { id: 42 }, response: { body: { hey: 'the answer' } } }
          ],
          {
            response: { body: { hey: 'default dude!' }, statusCode: 200 }
          }
        )
      );

      const dude1 = await call(app).get('/dude/1');
      expect(dude1.status).toEqual(200);
      expect(dude1.body).toEqual({ hey: 'dude number 1!' });

      const dude2 = await call(app).get('/dude/2');
      expect(dude2.status).toEqual(200);
      expect(dude2.body).toEqual({ hey: 'dude number 2!' });

      const dude3 = await call(app).get('/dude/3');
      expect(dude3.status).toEqual(200);
      expect(dude3.body).toEqual({ hey: 'default dude!' });

      const answer = await call(app).get('/dude/42');
      expect(answer.status).toEqual(200);
      expect(answer.body).toEqual({ hey: 'the answer' });
    });

    it('creates a scenario, with status codes', async () => {
      await stubFor(
        GET('/statuses/{bananas}'),
        containsScenarios(
          [
            { match: { bananas: 51 }, response: { body: {}, statusCode: 201 } },
            { match: { bananas: 29 }, response: { body: {}, statusCode: 303 } },
            { match: { bananas: 42 }, response: { body: {}, statusCode: 404 } }
          ],
          {
            response: { body: {}, statusCode: 200 }
          }
        )
      );

      const statuses51 = await call(app).get('/statuses/51');
      expect(statuses51.status).toEqual(201);
      expect(statuses51.body).toEqual({});

      const statuses29 = await call(app).get('/statuses/29');
      expect(statuses29.status).toEqual(303);
      expect(statuses29.body).toEqual({});

      const answer = await call(app).get('/statuses/42');
      expect(answer.status).toEqual(404);
      expect(answer.body).toEqual({});

      const defaultResponse = await call(app).get('/statuses/123321');
      expect(defaultResponse.status).toEqual(200);
      expect(defaultResponse.body).toEqual({});
    });

    it('creates a scenario, based on a query parameter', async () => {
      await stubFor(
        GET('/things?stuff={stuff}'),
        containsScenarios(
          [
            { match: { stuff: 'yes' }, response: { body: { some: 'thing' }, statusCode: 200 } },
            { match: { stuff: 'no' }, response: { body: {}, statusCode: 404 } }
          ],
          {
            response: { body: {}, statusCode: 404 }
          }
        )
      );

      const yes = await call(app).get('/things?stuff=yes');
      expect(yes.status).toEqual(200);
      expect(yes.body).toEqual({ some: 'thing' });

      const no = await call(app).get('/things?stuff=no');
      expect(no.status).toEqual(404);
      expect(no.body).toEqual({});

      const other = await call(app).get('/things?stuff=other');
      expect(other.status).toEqual(404);
      expect(other.body).toEqual({});
    });

    it('creates a scenario, with multiple capturing groups', async () => {
      await stubFor(
        GET('/many?things={things}&other-things={other-things}'),
        containsScenarios(
          [
            {
              match: { things: 'yes', 'other-things': 'yes' },
              response: { body: { gots: 'alls' }, statusCode: 200 }
            },
            {
              match: { things: 'yes', 'other-things': 'no' },
              response: { body: { gots: 'just some' }, statusCode: 200 }
            }
          ],
          {
            response: { body: { gots: 'not enough' }, statusCode: 404 }
          }
        )
      );

      const yes = await call(app).get('/many?things=yes&other-things=yes');
      expect(yes.status).toEqual(200);
      expect(yes.body).toEqual({ gots: 'alls' });

      const some = await call(app).get('/many?things=yes&other-things=no');
      expect(some.status).toEqual(200);
      expect(some.body).toEqual({ gots: 'just some' });

      const notEnough = await call(app).get('/many?things=no&other-things=yes');
      expect(notEnough.status).toEqual(404);
      expect(notEnough.body).toEqual({ gots: 'not enough' });

      const none = await call(app).get('/many?things=no&other-things=no');
      expect(none.status).toEqual(404);
      expect(none.body).toEqual({ gots: 'not enough' });
    });
  });

  describe('body matching', () => {
    it('matches requests based on their body', async () => {
      await stubFor(
        POST('/dude'), // TODO: why don't I have to add `.withBody(bla)`?
        containsScenarios(
          [
            { match: { id: 1 }, response: { body: { hey: 'dude number 1!' } } },
            { match: { id: 2 }, response: { body: { hey: 'dude number 2!' } } },
            { match: { id: 42 }, response: { body: { hey: 'the answer' } } }
          ],
          {
            response: { body: { hey: 'default dude!' }, statusCode: 200 }
          }
        )
      );

      const dude1 = await call(app)
        .post('/dude')
        .send({ id: 1 });
      expect(dude1.status).toEqual(200);
      expect(dude1.body).toEqual({ hey: 'dude number 1!' });

      const dude2 = await call(app)
        .post('/dude')
        .send({ id: 2 });
      expect(dude2.status).toEqual(200);
      expect(dude2.body).toEqual({ hey: 'dude number 2!' });

      const dudeDef = await call(app)
        .post('/dude')
        .send({ id: 444 });
      expect(dudeDef.status).toEqual(200);
      expect(dudeDef.body).toEqual({ hey: 'default dude!' });
    });

    it('matches requests based on their body, with multiple properties', async () => {
      await stubFor(
        POST('/bananas'), // TODO: why don't I have to add `.withBody(bla)`?
        containsScenarios(
          [
            { match: { id: 1, bananas: 'yes' }, response: { body: { hey: 'dude 1, bananas!' } } },
            { match: { id: 1, bananas: 'no' }, response: { body: { hey: 'dude 1, no bananas!' } } }
          ],
          {
            response: { body: { hey: 'whatever' }, statusCode: 200 }
          }
        )
      );

      const bananas = await call(app)
        .post('/bananas')
        .send({ id: 1, bananas: 'yes' });
      expect(bananas.status).toEqual(200);
      expect(bananas.body).toEqual({ hey: 'dude 1, bananas!' });

      const nobananas = await call(app)
        .post('/bananas')
        .send({ id: 1, bananas: 'no' });
      expect(nobananas.status).toEqual(200);
      expect(nobananas.body).toEqual({ hey: 'dude 1, no bananas!' });

      const dudeDef = await call(app)
        .post('/bananas')
        .send({ id: 444, bananas: 'whatever' });
      expect(dudeDef.status).toEqual(200);
      expect(dudeDef.body).toEqual({ hey: 'whatever' });
    });

    it('disambiguates by url', async () => {
      await stubFor(
        POST('/dude'),
        containsScenarios([], {
          response: { body: { hey: 'dude' }, statusCode: 200 }
        })
      );
      await stubFor(
        POST('/bananas'),
        containsScenarios([], {
          response: { body: { hey: 'bananas' }, statusCode: 200 }
        })
      );

      const dude = await call(app)
        .post('/dude')
        .send({ id: 1 });
      expect(dude.body).toEqual({ hey: 'dude' });

      const bananas = await call(app)
        .post('/bananas')
        .send({ id: 1 });
      expect(bananas.body).toEqual({ hey: 'bananas' });
    });
  });

  it('clears scenarios on demand', async () => {
    await stubFor(
      POST('/some/{id}'),
      containsScenarios([], {
        response: { body: { hey: 'you' }, statusCode: 200 }
      })
    );

    const some = await call(app).get('/some/1');
    expect(some.status).toEqual(200);
    expect(some.body).toEqual({ hey: 'you' });

    await axios.delete('http://localhost:9019/scenarios');

    const someCleared = await call(app).get('/some/1');
    expect(someCleared.status).toEqual(404);
  });

  it('returns all scenarios', async () => {
    await stubFor(
      POST('/some/{id}'),
      containsScenarios([], {
        response: { body: { hey: 'you' }, statusCode: 200 }
      })
    );
    await stubFor(
      POST('/some-other/{bananas}/{more}'),
      containsScenarios(
        [
          {
            match: { bananas: '1' },
            response: { body: {}, statusCode: 200 }
          }
        ],
        {
          response: { body: {}, statusCode: 404 }
        }
      )
    );
    await stubFor(
      POST('/with-body').withBody({ customerId: '*' }),
      containsScenarios(
        [
          {
            match: { customerId: '1' },
            response: { body: { name: 'jimbo' }, statusCode: 200 }
          }
        ],
        {
          response: { body: {}, statusCode: 404 }
        }
      )
    );

    const allScenarios = await call(app).get('/scenarios');
    expect(allScenarios.status).toEqual(200);
    expect(allScenarios.body).toEqual([
      {
        urlMatcher: {
          url: '/some/{id}',
          variableNames: ['id'],
          regex: '/\\/some\\/(.*)/g'
        },
        bodyMatcher: {},
        outcomes: [],
        defaultResponse: {
          response: { body: { hey: 'you' }, statusCode: 200 }
        }
      },
      {
        urlMatcher: {
          url: '/some-other/{bananas}/{more}',
          variableNames: ['bananas', 'more'],
          regex: '/\\/some-other\\/(.*)\\/(.*)/g'
        },
        bodyMatcher: {},
        outcomes: [
          {
            match: { bananas: '1' },
            response: { body: {}, statusCode: 200 }
          }
        ],
        defaultResponse: {
          response: { body: {}, statusCode: 404 }
        }
      },
      {
        urlMatcher: {
          url: '/with-body',
          regex: 'N/A'
        },
        bodyMatcher: {
          body: { customerId: '*' },
          keys: ['customerId']
        },
        outcomes: [
          {
            match: { customerId: '1' },
            response: { body: { name: 'jimbo' }, statusCode: 200 }
          }
        ],
        defaultResponse: {
          response: { body: {}, statusCode: 404 }
        }
      }
    ]);
  });

  it('updates when the same url is used to setup a new scenario', async () => {
    await stubFor(
      POST('/some/{id}'),
      containsScenarios([], {
        response: { body: { hey: 'initial' }, statusCode: 200 }
      })
    );
    await stubFor(
      POST('/some/{id}'),
      containsScenarios([], {
        response: { body: { hey: 'updated' }, statusCode: 200 }
      })
    );

    const scenario = await call(app).get('/scenarios');
    expect(scenario.status).toEqual(200);
    expect(scenario.body).toEqual([
      {
        urlMatcher: {
          url: '/some/{id}',
          variableNames: ['id'],
          regex: '/\\/some\\/(.*)/g'
        },
        bodyMatcher: {},
        outcomes: [],
        defaultResponse: {
          response: { body: { hey: 'updated' }, statusCode: 200 }
        }
      }
    ]);
  });
});
