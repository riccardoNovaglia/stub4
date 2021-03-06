const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort, scenarios } = require('@stub4/client');
const { GET, POST, url } = require('@stub4/client/src/RequestMatcher');
const { containsScenarios } = require('@stub4/client/src/ScenariosResponse');

jest.mock('uuid', () => ({
  v4: () => 'some-id'
}));

describe('Configuring scenarios', () => {
  const testClient = TestClient();
  beforeAll(() => setup(stub4, setPort, testClient));
  afterEach(() => stub4.clearAll());
  afterAll(() => stub4.shutdown());

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

      const dude1 = await testClient.get('/dude/1');
      expect(dude1.status).toEqual(200);
      expect(dude1.body).toEqual({ hey: 'dude number 1!' });

      const dude2 = await testClient.get('/dude/2');
      expect(dude2.status).toEqual(200);
      expect(dude2.body).toEqual({ hey: 'dude number 2!' });

      const dude3 = await testClient.get('/dude/3');
      expect(dude3.status).toEqual(200);
      expect(dude3.body).toEqual({ hey: 'default dude!' });

      const answer = await testClient.get('/dude/42');
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

      const statuses51 = await testClient.get('/statuses/51');
      expect(statuses51.status).toEqual(201);
      expect(statuses51.body).toEqual({});

      const statuses29 = await testClient.get('/statuses/29');
      expect(statuses29.status).toEqual(303);
      expect(statuses29.body).toEqual({});

      const answer = await testClient.get('/statuses/42');
      expect(answer.status).toEqual(404);
      expect(answer.body).toEqual({});

      const defaultResponse = await testClient.get('/statuses/123321');
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

      const yes = await testClient.get('/things?stuff=yes');
      expect(yes.status).toEqual(200);
      expect(yes.body).toEqual({ some: 'thing' });

      const no = await testClient.get('/things?stuff=no');
      expect(no.status).toEqual(404);
      expect(no.body).toEqual({});

      const other = await testClient.get('/things?stuff=other');
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

      const yes = await testClient.get('/many?things=yes&other-things=yes');
      expect(yes.status).toEqual(200);
      expect(yes.body).toEqual({ gots: 'alls' });

      const some = await testClient.get('/many?things=yes&other-things=no');
      expect(some.status).toEqual(200);
      expect(some.body).toEqual({ gots: 'just some' });

      const notEnough = await testClient.get('/many?things=no&other-things=yes');
      expect(notEnough.status).toEqual(404);
      expect(notEnough.body).toEqual({ gots: 'not enough' });

      const none = await testClient.get('/many?things=no&other-things=no');
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

      const dude1 = await testClient.post('/dude', { id: 1 });
      expect(dude1.status).toEqual(200);
      expect(dude1.body).toEqual({ hey: 'dude number 1!' });

      const dude2 = await testClient.post('/dude', { id: 2 });
      expect(dude2.status).toEqual(200);
      expect(dude2.body).toEqual({ hey: 'dude number 2!' });

      const dudeDef = await testClient.post('/dude', { id: 444 });
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

      const bananas = await testClient.post('/bananas', { id: 1, bananas: 'yes' });
      expect(bananas.status).toEqual(200);
      expect(bananas.body).toEqual({ hey: 'dude 1, bananas!' });

      const nobananas = await testClient.post('/bananas', { id: 1, bananas: 'no' });
      expect(nobananas.status).toEqual(200);
      expect(nobananas.body).toEqual({ hey: 'dude 1, no bananas!' });

      const dudeDef = await testClient.post('/bananas', { id: 444, bananas: 'whatever' });
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

      const dude = await testClient.post('/dude', { id: 1 });
      expect(dude.body).toEqual({ hey: 'dude' });

      const bananas = await testClient.post('/bananas', { id: 1 });
      expect(bananas.body).toEqual({ hey: 'bananas' });
    });
  });

  describe('basic setup', () => {
    it('returns the built scenario', async () => {
      const scenario = await stubFor(
        url('/some/{id}'),
        containsScenarios([], {
          response: { body: { hey: 'you' }, statusCode: 200 }
        })
      );
      expect(scenario).toEqual({
        id: 'some-id',
        requestMatcher: {
          url: '/some/{id}',
          urlMatcher: {
            url: '/some/{id}',
            variableNames: ['id'],
            regex: '/\\/some\\/(.*)/g'
          },
          method: '*'
        },
        scenarios: {
          outcomes: [],
          defaultResponse: {
            body: { hey: 'you' },
            statusCode: 200,
            contentType: 'application/json'
          }
        }
      });
    });

    it('deletes one scenario using its id', async () => {
      const scenario = await stubFor(
        url('/some/{id}'),
        containsScenarios([], {
          response: { body: { hey: 'you' }, statusCode: 200 }
        })
      );
      const deleteResponse = await testClient.delete(`/scenarios/${scenario.id}`);
      expect(deleteResponse.status).toEqual(200);
      const response = await testClient.get('/some/value');
      expect(response.status).toEqual(404);
    });

    it('clears scenarios on demand', async () => {
      await stubFor(
        url('/some/{id}'),
        containsScenarios([], {
          response: { body: { hey: 'you' }, statusCode: 200 }
        })
      );

      const some = await testClient.get('/some/1');
      expect(some.status).toEqual(200);
      expect(some.body).toEqual({ hey: 'you' });

      stub4.clearAll();

      const someCleared = await testClient.get('/some/1');
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

      const allScenarios = await testClient.get('/scenarios');
      expect(allScenarios.status).toEqual(200);
      expect(allScenarios.body).toEqual([
        {
          id: 'some-id',
          requestMatcher: {
            url: '/some/{id}',
            urlMatcher: {
              url: '/some/{id}',
              variableNames: ['id'],
              regex: '/\\/some\\/(.*)/g'
            },
            method: 'POST'
          },
          scenarios: {
            outcomes: [],
            defaultResponse: {
              body: { hey: 'you' },
              statusCode: 200,
              contentType: 'application/json'
            }
          }
        },
        {
          id: 'some-id',
          requestMatcher: {
            url: '/some-other/{bananas}/{more}',
            urlMatcher: {
              url: '/some-other/{bananas}/{more}',
              variableNames: ['bananas', 'more'],
              regex: '/\\/some-other\\/(.*)\\/(.*)/g'
            },
            method: 'POST'
          },
          scenarios: {
            outcomes: [
              {
                match: { bananas: '1' },
                response: { body: {}, statusCode: 200 }
              }
            ],
            defaultResponse: {
              body: {},
              statusCode: 404,
              contentType: 'application/json'
            }
          }
        },
        {
          id: 'some-id',
          requestMatcher: {
            url: '/with-body',
            body: {
              value: { customerId: '*' },
              keys: ['customerId'],
              type: 'json'
            },
            method: 'POST'
          },
          scenarios: {
            outcomes: [
              {
                match: { customerId: '1' },
                response: { body: { name: 'jimbo' }, statusCode: 200 }
              }
            ],
            defaultResponse: {
              body: {},
              statusCode: 404,
              contentType: 'application/json'
            }
          }
        }
      ]);
    });

    it('updates posting a scenario with the same id', async () => {
      const scenario = await stubFor(
        GET('/some/{id}'),
        containsScenarios([], {
          response: { body: { hey: 'initial' }, statusCode: 200 }
        })
      );
      await stubFor({
        ...scenario,
        scenarios: {
          ...scenario.scenarios,
          default: {
            response: { body: { hey: 'updated' }, statusCode: 200, contentType: 'application/json' }
          }
        }
      });
      const response = await testClient.get('/some/test');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ hey: 'updated' });
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

      const scenario = await testClient.get('/scenarios');
      expect(scenario.status).toEqual(200);
      expect(scenario.body).toEqual([
        {
          id: 'some-id',
          requestMatcher: {
            url: '/some/{id}',
            urlMatcher: {
              url: '/some/{id}',
              variableNames: ['id'],
              regex: '/\\/some\\/(.*)/g'
            },
            method: 'POST'
          },
          scenarios: {
            outcomes: [],
            defaultResponse: {
              body: { hey: 'updated' },
              statusCode: 200,
              contentType: 'application/json'
            }
          }
        }
      ]);
    });

    it.only('can enable and disable a scenario by id', async () => {
      const scenario = await stubFor(
        GET('/something/{irrelevant}'),
        containsScenarios([], {
          response: { statusCode: 200 }
        })
      );

      const res = await testClient.get('/something/bla');
      expect(res.status).toEqual(200);

      await scenarios.setEnabled(scenario, false);
      const res2 = await testClient.get('/something/bla');
      expect(res2.status).toEqual(404);

      await scenarios.setEnabled(scenario, true);
      const res3 = await testClient.get('/something/bla');
      expect(res3.status).toEqual(200);
    });
  });
});
