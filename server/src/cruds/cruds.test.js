const request = require('supertest');
const app = require('../app');

describe('Create crud-like endpoints', () => {
  it('exists', async () => {
    const response = await request(app)
      .post('/cruds/new')
      .send({ url: '/some-url' });
    expect(response.status).toEqual(200);
  });

  it('deletes all cruds on demand', async () => {
    await request(app)
      .post('/cruds/new')
      .send({ url: '/some-url' });
    await request(app)
      .post('/some-url')
      .send({ id: '1', name: 'stuff' });
    await request(app).post('/cruds/clear');
    const response = await request(app).get('/some-url/1');
    expect(response.status).toEqual(404);
  });

  it('can list all existing ones, their urls and id aliases', async () => {
    await request(app)
      .post('/cruds/new')
      .send({ url: '/some-url' });
    await request(app)
      .post('/cruds/new')
      .send({ url: '/some-other-one', idAlias: 'thingId' });

    const response = await request(app).get('/cruds');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      { url: '/some-url', idAlias: 'id' },
      { url: '/some-other-one', idAlias: 'thingId' }
    ]);
  });
});

describe('Once the crud is created', () => {
  const url = '/some-crud';
  beforeEach(async () => {
    await request(app)
      .post('/cruds/new')
      .send({ url });
  });
  afterEach(async () => await request(app).post('/cruds/clear'));

  it('can add things', async () => {
    const response = await request(app)
      .post(url)
      .send({ id: '1', name: 'jimmy' });
    expect(response.status).toEqual(200);
  });

  it('can get things out that were added', async () => {
    await request(app)
      .post(url)
      .send({ id: '1', name: 'jimmy' });
    const response = await request(app).get(`${url}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '1', name: 'jimmy' });
  });

  it('updates already existing items on post', async () => {
    await request(app)
      .post(url)
      .send({ id: '1', name: 'jimmy' });

    await request(app)
      .post(url)
      .send({ id: '1', name: 'banana' });
    const response = await request(app).get(`${url}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '1', name: 'banana' });
  });

  it('deletes things', async () => {
    await request(app)
      .post(url)
      .send({ id: '1', name: 'jimmy' });

    await request(app).delete(`${url}/1`);

    const response = await request(app).get(`${url}/1`);
    expect(response.status).toEqual(404);
  });

  it('dumps everything out of the crud', async () => {
    await request(app)
      .post(url)
      .send({ id: '1', name: 'jimmy' });
    await request(app)
      .post(url)
      .send({ id: '2', name: 'giorgy' });

    const response = await request(app).get(url);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([{ id: '1', name: 'jimmy' }, { id: '2', name: 'giorgy' }]);
  });

  it('returns an empty list for an empty crud', async () => {
    const response = await request(app).get(url);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
});

describe('Custom IDs', () => {
  const url = '/custom-id-crud';
  afterEach(async () => await request(app).post('/clear-cruds'));
  it('accepts an id alias on creation and uses that going forward', async () => {
    await request(app)
      .post('/cruds/new')
      .send({ url: '/custom-id-crud', idAlias: 'customerId' });

    await request(app)
      .post('/custom-id-crud')
      .send({ customerId: '1', name: 'michelangelo' });

    const response = await request(app).get('/custom-id-crud/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ customerId: '1', name: 'michelangelo' });
  });

  it('deletes using a custom id', async () => {
    await request(app)
      .post('/cruds/new')
      .send({ url, idAlias: 'customerId' });
    await request(app)
      .post(url)
      .send({ customerId: '2', name: 'michelangelo' });

    await request(app).delete(`${url}/2`);

    const response = await request(app).get(`${url}/2`);
    expect(response.status).toBe(404);
  });
});

describe('Complex urls', () => {
  it('can create crud-likes with complex urls', async () => {
    const response = await request(app)
      .post('/cruds/new')
      .send({ url: '/some-url/with/version123' });
    expect(response.status).toEqual(200);
  });

  it('can get stuff out of complex urls', async () => {
    const url = '/some-url/with/version123';
    await request(app)
      .post('/cruds/new')
      .send({ url });

    await request(app)
      .post(url)
      .send({ id: '2', name: 'leonardo' });

    const response = await request(app).get(`${url}/2`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: '2', name: 'leonardo' });
  });

  it('can get everything out of complex urls', async () => {
    const url = '/some-url/with/version123';
    await request(app)
      .post('/cruds/new')
      .send({ url });

    await request(app)
      .post(url)
      .send({ id: '2', name: 'leonardo' });
    await request(app)
      .post(url)
      .send({ id: '3', name: 'raffaello' });

    const response = await request(app).get(`${url}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([{ id: '2', name: 'leonardo' }, { id: '3', name: 'raffaello' }]);
  });
});
