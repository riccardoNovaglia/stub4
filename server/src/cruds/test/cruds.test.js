const stub4 = require('../../index');
const { TestClient, setup } = require('../../testClient/TestClient');

const { stubFor, setPort } = require('@stub4/client');
const { url } = require('@stub4/client/src/RequestMatcher');
const { containsCrud } = require('@stub4/client/src/Crud');

jest.mock('uuid', () => ({
  v4: () => 'some-id'
}));

const testClient = TestClient();
beforeAll(() => setup(stub4, setPort, testClient));
afterEach(() => stub4.clearAll());
afterAll(() => stub4.shutdown());

describe('Create crud-like endpoints', () => {
  it('can list all existing ones, their urls and id aliases', async () => {
    await stubFor(url('/some-url'), containsCrud());
    await stubFor(url('/some-other-one'), containsCrud().withIdAlias('thingId'));

    const response = await testClient.get('/cruds');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      { id: 'some-id', url: '/some-url', idAlias: 'id' },
      { id: 'some-id', url: '/some-other-one', idAlias: 'thingId' }
    ]);
  });

  it('deletes all cruds on demand', async () => {
    await stubFor(url('/some-url'), containsCrud());

    await testClient.post('/some-url', { id: '1', name: 'stuff' });
    await testClient.delete('/cruds');
    const response = await testClient.get('/some-url/1');
    expect(response.status).toEqual(404);
  });

  it('returns the built crud on creation', async () => {
    const crud = await stubFor(url('/things'), containsCrud());
    expect(crud).toEqual({
      id: 'some-id',
      requestMatcher: { url: '/things' },
      crud: { meta: { idAlias: 'id' }, items: [] }
    });
  });

  it('returns the build crud when queried by id', async () => {
    const crud = await stubFor(url('/stuff'), containsCrud());
    const gotCrud = await testClient.get(`/cruds/${crud.id}`);
    expect(gotCrud.data).toEqual({
      id: 'some-id',
      requestMatcher: { url: '/stuff' },
      crud: { meta: { idAlias: 'id' }, items: [] }
    });
    expect(gotCrud.data).toEqual(crud);
  });

  it('updates the crud when posted with id', async () => {
    const crud = await stubFor(url('/things'), containsCrud());
    const updated = await stubFor({
      ...crud,
      requestMatcher: { url: '/other-stuff' }
    });
    expect(updated).toEqual({
      id: 'some-id',
      requestMatcher: { url: '/other-stuff' },
      crud: { meta: { idAlias: 'id' }, items: [] }
    });
  });

  it('deletes the crud by id', async () => {
    const crud = await stubFor(url('/bananas'), containsCrud());
    const response = await testClient.post('/bananas', { id: '1', some: 'thing' });
    expect(response.status).toEqual(200);
    await testClient.delete(`/cruds/${crud.id}`);
    const deleted = await testClient.post('/bananas', { id: '1', some: 'thing' });
    expect(deleted.status).toEqual(404);
  });
});

describe('Once the crud is created', () => {
  const crudUrl = '/some-crud';
  beforeEach(async () => await stubFor(url(crudUrl), containsCrud()));

  it('can add things', async () => {
    const response = await testClient.post(crudUrl, { id: '1', name: 'jimmy' });
    expect(response.status).toEqual(200);
  });

  it('can get things out that were added', async () => {
    await testClient.post(crudUrl, { id: '1', name: 'jimmy' });
    const response = await testClient.get(`${crudUrl}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '1', name: 'jimmy' });
  });

  it('updates already existing items on post', async () => {
    await testClient.post(crudUrl, { id: '1', name: 'jimmy' });

    await testClient.post(crudUrl, { id: '1', name: 'banana' });
    const response = await testClient.get(`${crudUrl}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '1', name: 'banana' });
  });

  it('performs partial updates with patch', async () => {
    await testClient.post(crudUrl, { id: '1', name: 'jimmy', surname: 'bananas' });

    await testClient.patch(crudUrl, { id: '1', surname: 'patatas' });
    const response = await testClient.get(`${crudUrl}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '1', name: 'jimmy', surname: 'patatas' });
  });

  it('performs partial updates on post when instructed', async () => {
    const someOtherCrudUrl = '/some-other-url';
    await stubFor(url(someOtherCrudUrl), containsCrud().withPatchOnPost(true));
    await testClient.post(someOtherCrudUrl, { id: '1', name: 'jimmy', surname: 'bananas' });

    await testClient.post(someOtherCrudUrl, { id: '1', surname: 'patatas' });
    const response = await testClient.get(`${someOtherCrudUrl}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '1', name: 'jimmy', surname: 'patatas' });
  });

  it('deletes things', async () => {
    await testClient.post(crudUrl, { id: '1', name: 'jimmy' });

    await testClient.delete(`${crudUrl}/1`);

    const response = await testClient.get(`${crudUrl}/1`);
    expect(response.status).toEqual(404);
  });

  it('dumps everything out of the crud', async () => {
    await testClient.post(crudUrl, { id: '1', name: 'jimmy' });
    await testClient.post(crudUrl, { id: '2', name: 'giorgy' });

    const response = await testClient.get(crudUrl);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      { id: '1', name: 'jimmy' },
      { id: '2', name: 'giorgy' }
    ]);
  });

  it('returns an empty list for an empty crud', async () => {
    const response = await testClient.get(crudUrl);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
});

describe('Custom IDs', () => {
  const crudUrl = '/custom-id-crud';
  it('accepts an id alias on creation and uses that going forward', async () => {
    await stubFor(url(crudUrl), containsCrud().withIdAlias('customerId'));

    await testClient.post('/custom-id-crud', { customerId: '1', name: 'michelangelo' });

    const response = await testClient.get('/custom-id-crud/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ customerId: '1', name: 'michelangelo' });
  });

  it('deletes using a custom id', async () => {
    await stubFor(url(crudUrl), containsCrud().withIdAlias('customerId'));
    await testClient.post(crudUrl, { customerId: '2', name: 'michelangelo' });

    await testClient.delete(`${crudUrl}/2`);

    const response = await testClient.get(`${crudUrl}/2`);
    expect(response.status).toBe(404);
  });

  it('defaults to "id" if an empty string is passed', async () => {
    await stubFor(url(crudUrl), containsCrud());

    await testClient.post('/custom-id-crud', { id: '1', name: 'michelangelo' });

    const response = await testClient.get('/custom-id-crud/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'michelangelo' });
  });
});

describe('Complex urls', () => {
  it('can create crud-likes with complex urls', async () => {
    await stubFor(url('/some-url/with/version123'), containsCrud());
  });

  it('can get stuff out of complex urls', async () => {
    const crudUrl = '/some-url/with/version123';
    await stubFor(url(crudUrl), containsCrud());

    await testClient.post(crudUrl, { id: '2', name: 'leonardo' });

    const response = await testClient.get(`${crudUrl}/2`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '2', name: 'leonardo' });
  });

  it('can get everything out of complex urls', async () => {
    const crudUrl = '/some-url/with/version123';
    await stubFor(url(crudUrl), containsCrud());

    await testClient.post(crudUrl, { id: '2', name: 'leonardo' });
    await testClient.post(crudUrl, { id: '3', name: 'raffaello' });

    const response = await testClient.get(`${crudUrl}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      { id: '2', name: 'leonardo' },
      { id: '3', name: 'raffaello' }
    ]);
  });
});
