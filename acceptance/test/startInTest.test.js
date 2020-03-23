const axios = require('axios');
const stub4 = require('@stub4/stub4');
const { stubFor, setPort } = require('@stub4/client');
const { url, GET, request } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');
const { containsCrud } = require('@stub4/client/src/Crud');
const { containsScenarios } = require('@stub4/client/src/ScenariosResponse');
const { proxyTo } = require('@stub4/client/src/Proxy');

test('starts and instance of stub4 in the tests and creates a stub', async () => {
  const { listeningPort } = stub4.startup();
  setPort(listeningPort);

  await stubFor(request('/john'), respondsWith(200));

  const stubbedResponse = await axios.get(`http://localhost:${listeningPort}/john`);
  expect(stubbedResponse.status).toEqual(200);
  expect(stubbedResponse.data).toEqual({});
  stub4.shutdown();
});

describe('uses before each and after each to start and stop stub4', () => {
  beforeAll(() => {
    const { listeningPort } = stub4.startup();
    setPort(listeningPort);
  });

  afterEach(() => stub4.clearAll());
  afterAll(() => stub4.shutdown());

  test('creates a stub', async () => {
    const port = stub4.listeningPort();
    await stubFor(request('/a-new-stub'), respondsWith(200));

    const stubbedResponse = await axios.get(`http://localhost:${port}/a-new-stub`);
    expect(stubbedResponse.status).toEqual(200);
    expect(stubbedResponse.data).toEqual({});
  });

  test('creates a crud', async () => {
    const port = stub4.listeningPort();
    const crudPath = '/some-crud';
    const crudUrl = `http://localhost:${port}${crudPath}`;

    await stubFor(url(crudPath), containsCrud());

    await axios.post(crudUrl, { id: '1', name: 'jimmy' });

    const response = await axios.get(`${crudUrl}/1`);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual({ id: '1', name: 'jimmy' });
  });

  test('creates a scenario', async () => {
    const port = stub4.listeningPort();
    const scenarioUrl = `http://localhost:${port}`;

    await stubFor(
      GET('/dude/{id}'),
      containsScenarios(
        [
          { match: { id: 1 }, response: { body: { hey: 'dude number 1!' } } },
          { match: { id: 42 }, response: { body: { hey: 'the answer' } } }
        ],
        {
          response: { body: { hey: 'default dude!' }, statusCode: 201 }
        }
      )
    );

    const dude1 = await axios.get(`${scenarioUrl}/dude/1`);
    expect(dude1.status).toEqual(200);
    expect(dude1.data).toEqual({ hey: 'dude number 1!' });

    const answer = await axios.get(`${scenarioUrl}/dude/42`);
    expect(answer.status).toEqual(200);
    expect(answer.data).toEqual({ hey: 'the answer' });

    const dude3 = await axios.get(`${scenarioUrl}/dude/whatever`);
    expect(dude3.status).toEqual(201);
    expect(dude3.data).toEqual({ hey: 'default dude!' });
  });

  test('creates a proxy', async () => {
    const port = stub4.listeningPort();

    await stubFor(GET('/bananas'), respondsWith(200, 'json', { msg: 'it worked!' }));

    await stubFor(GET('/john'), proxyTo(`http://localhost:${port}/bananas`));

    const proxiedResponse = await axios.get(`http://localhost:${port}/john`);
    expect(proxiedResponse.status).toEqual(200);
    expect(proxiedResponse.data).toEqual({ msg: 'it worked!' });
  });
});
