const axios = require('axios');
const request = require('supertest');
const enableDestroy = require('server-destroy');

const app = require('../../app');

const { stubFor, setPort } = require('@stub4/client');
const { url } = require('@stub4/client/src/RequestMatcher');
const { containsCrud } = require('@stub4/client/src/Crud');

setPort(9011);
describe('Cruds', () => {
  let server;
  beforeAll(done => {
    server = app.listen(9011, done);
    enableDestroy(server);
  });
  afterAll(() => server.destroy());
  afterEach(async () => await axios.delete('http://localhost:9011/cruds'));

  describe('Create crud-like endpoints', () => {
    it('can list all existing ones, their urls and id aliases', async () => {
      await stubFor(url('/some-url'), containsCrud());
      await stubFor(url('/some-other-one'), containsCrud().withIdAlias('thingId'));

      const response = await request(app).get('/cruds');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { url: '/some-url', idAlias: 'id' },
        { url: '/some-other-one', idAlias: 'thingId' }
      ]);
    });

    it('deletes all cruds on demand', async () => {
      await stubFor(url('/some-url'), containsCrud());

      await request(app)
        .post('/some-url')
        .send({ id: '1', name: 'stuff' });
      await request(app).delete('/cruds');
      const response = await request(app).get('/some-url/1');
      expect(response.status).toEqual(404);
    });
  });

  describe('Once the crud is created', () => {
    const crudUrl = '/some-crud';
    beforeEach(async () => await stubFor(url(crudUrl), containsCrud()));

    it('can add things', async () => {
      const response = await request(app)
        .post(crudUrl)
        .send({ id: '1', name: 'jimmy' });
      expect(response.status).toEqual(200);
    });

    it('can get things out that were added', async () => {
      await request(app)
        .post(crudUrl)
        .send({ id: '1', name: 'jimmy' });
      const response = await request(app).get(`${crudUrl}/1`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: '1', name: 'jimmy' });
    });

    it('updates already existing items on post', async () => {
      await request(app)
        .post(crudUrl)
        .send({ id: '1', name: 'jimmy' });

      await request(app)
        .post(crudUrl)
        .send({ id: '1', name: 'banana' });
      const response = await request(app).get(`${crudUrl}/1`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: '1', name: 'banana' });
    });

    it('performs partial updates with patch', async () => {
      await request(app)
        .post(crudUrl)
        .send({ id: '1', name: 'jimmy', surname: 'bananas' });

      await request(app)
        .patch(crudUrl)
        .send({ id: '1', surname: 'patatas' });
      const response = await request(app).get(`${crudUrl}/1`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: '1', name: 'jimmy', surname: 'patatas' });
    });

    it('performs partial updates on post when instructed', async () => {
      const someOtherCrudUrl = '/some-other-url';
      await stubFor(url(someOtherCrudUrl), containsCrud().withPatchOnPost(true));
      await request(app)
        .post(someOtherCrudUrl)
        .send({ id: '1', name: 'jimmy', surname: 'bananas' });

      await request(app)
        .post(someOtherCrudUrl)
        .send({ id: '1', surname: 'patatas' });
      const response = await request(app).get(`${someOtherCrudUrl}/1`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: '1', name: 'jimmy', surname: 'patatas' });
    });

    it('deletes things', async () => {
      await request(app)
        .post(crudUrl)
        .send({ id: '1', name: 'jimmy' });

      await request(app).delete(`${crudUrl}/1`);

      const response = await request(app).get(`${crudUrl}/1`);
      expect(response.status).toEqual(404);
    });

    it('dumps everything out of the crud', async () => {
      await request(app)
        .post(crudUrl)
        .send({ id: '1', name: 'jimmy' });
      await request(app)
        .post(crudUrl)
        .send({ id: '2', name: 'giorgy' });

      const response = await request(app).get(crudUrl);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([{ id: '1', name: 'jimmy' }, { id: '2', name: 'giorgy' }]);
    });

    it('returns an empty list for an empty crud', async () => {
      const response = await request(app).get(crudUrl);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('Custom IDs', () => {
    const crudUrl = '/custom-id-crud';
    it('accepts an id alias on creation and uses that going forward', async () => {
      await stubFor(url(crudUrl), containsCrud().withIdAlias('customerId'));

      await request(app)
        .post('/custom-id-crud')
        .send({ customerId: '1', name: 'michelangelo' });

      const response = await request(app).get('/custom-id-crud/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ customerId: '1', name: 'michelangelo' });
    });

    it('deletes using a custom id', async () => {
      await stubFor(url(crudUrl), containsCrud().withIdAlias('customerId'));
      await request(app)
        .post(crudUrl)
        .send({ customerId: '2', name: 'michelangelo' });

      await request(app).delete(`${crudUrl}/2`);

      const response = await request(app).get(`${crudUrl}/2`);
      expect(response.status).toBe(404);
    });

    it('defaults to "id" if an empty string is passed', async () => {
      await stubFor(url(crudUrl), containsCrud());

      await request(app)
        .post('/custom-id-crud')
        .send({ id: '1', name: 'michelangelo' });

      const response = await request(app).get('/custom-id-crud/1');
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

      await request(app)
        .post(crudUrl)
        .send({ id: '2', name: 'leonardo' });

      const response = await request(app).get(`${crudUrl}/2`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: '2', name: 'leonardo' });
    });

    it('can get everything out of complex urls', async () => {
      const crudUrl = '/some-url/with/version123';
      await stubFor(url(crudUrl), containsCrud());

      await request(app)
        .post(crudUrl)
        .send({ id: '2', name: 'leonardo' });
      await request(app)
        .post(crudUrl)
        .send({ id: '3', name: 'raffaello' });

      const response = await request(app).get(`${crudUrl}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { id: '2', name: 'leonardo' },
        { id: '3', name: 'raffaello' }
      ]);
    });
  });
});
