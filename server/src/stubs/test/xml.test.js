const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { GET, POST } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

it('responds from the new stub with the given body', async () => {
  await stubFor(GET('/whateva'), respondsWith(200, 'xml', '<xml></xml>'));

  const response = await testClient.get('/whateva');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual('<xml></xml>');
});

it('responds with the correct body format and header given a response type', async () => {
  await stubFor(GET('/a-new-one'), respondsWith(200, 'xml', '<xml></xml>'));

  const response = await testClient.get('/a-new-one');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual('<xml></xml>');
  expect(response.headers).toMatchObject({
    'content-type': 'application/xml; charset=utf-8'
  });
});

describe('body matching', () => {
  it('sets up a stub with xml body matching', async () => {
    await stubFor(
      POST('/books').withXmlBodyMatch([{ path: 'string(//title)', value: 'Harry Potter' }]),
      respondsWith(200, 'xml', `<msg>yer a wizard</msg>`)
    );

    const stubbedResponse = await testClient.post(
      '/books',
      "<book author='J. K. Rowling'><title>Harry Potter</title></book>",
      { 'Content-Type': 'text/xml' }
    );
    expect(stubbedResponse.status).toEqual(200);
    expect(stubbedResponse.body).toEqual(`<msg>yer a wizard</msg>`);

    const matchMiss = await testClient.post(
      '/books',
      "<book author='J. K. Rowling'><title>Jerry Potter</title></book>",
      { 'Content-Type': 'text/xml' }
    );
    expect(matchMiss.status).toEqual(404);
  });

  it('multiple value match', async () => {
    await stubFor(
      POST('/books').withXmlBodyMatch([
        { path: 'string(//title)', value: 'Harry Potter' },
        { path: 'string(/book/@author)', value: 'J. K. Rowling' }
      ]),
      respondsWith(200, 'xml', `<msg>yer a wizard</msg>`)
    );

    const stubbedResponse = await testClient.post(
      '/books',
      "<book author='J. K. Rowling'><title>Harry Potter</title></book>",
      { 'Content-Type': 'text/xml' }
    );
    expect(stubbedResponse.status).toEqual(200);
    expect(stubbedResponse.body).toEqual(`<msg>yer a wizard</msg>`);

    const titleMiss = await testClient.post(
      '/books',
      "<book author='J. K. Rowling'><title>Jerry Potter</title></book>",
      { 'Content-Type': 'text/xml' }
    );
    expect(titleMiss.status).toEqual(404);

    const authorMiss = await testClient.post(
      '/books',
      "<book author='J. J. Rowling'><title>Harry Potter</title></book>",
      { 'Content-Type': 'text/xml' }
    );
    expect(authorMiss.status).toEqual(404);
  });
});
