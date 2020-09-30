const stub4 = require('../index');
const { TestClient, setup } = require('../testClient/TestClient');
const { setPort } = require('@stub4/client');

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

describe('adding items via js in order to have dynamic fields', () => {
  it('allows adding stubs', async () => {
    stub4.addItems([
      {
        requestMatcher: { url: '/some/url' },
        response: { body: { msg: 'ok!', now: new Date('2020-07-24').toISOString() } }
      }
    ]);

    const response = await testClient.get('/some/url');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ msg: 'ok!', now: '2020-07-24T00:00:00.000Z' });
  });

  it('allows adding cruds', async () => {
    const crudUrl = '/some-crud';
    stub4.addItems([
      {
        requestMatcher: { url: '/some-crud' },
        crud: {}
      }
    ]);

    await testClient.post(crudUrl, { id: '1', name: 'jimmy' });

    const response = await testClient.get(`${crudUrl}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '1', name: 'jimmy' });
  });

  it('allows adding scenarios', async () => {
    stub4.addItems([
      {
        requestMatcher: { url: '/stuff/{xxx}' },
        scenarios: {
          outcomes: [{ match: { xxx: 1 }, response: { body: { msg: 'outcome' } } }],
          default: { response: { body: { msg: 'defaults' }, statusCode: 200 } }
        }
      }
    ]);

    const outcome = await testClient.get('/stuff/1');
    expect(outcome.body).toEqual({ msg: 'outcome' });
    const def = await testClient.get('/stuff/');
    expect(def.body).toEqual({ msg: 'defaults' });
  });

  it('allows adding proxy', async () => {
    const stub4Host = () => `http://localhost:${stub4.stubsPort()}`;
    stub4.addItems([
      {
        requestMatcher: { url: '/with-date' },
        response: { body: { now: new Date('2020-07-24').toISOString() } }
      },
      {
        requestMatcher: { url: '/gimme-date' },
        proxy: { destinationUrl: `${stub4Host()}/with-date` }
      }
    ]);

    const response = await testClient.get('/gimme-date');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ now: '2020-07-24T00:00:00.000Z' });
  });

  it("doesn't fail when given an unsupported object but logs it", async () => {
    stub4.addItems([
      {
        requestMatcher: { url: '/with-date' },
        bananas: {}
      }
    ]);
  });
});
