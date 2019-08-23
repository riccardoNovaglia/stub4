const request = require('supertest');
const app = require('./app');

describe('Create db-like endpoints', () => {
  it('exists', async () => {
    const response = await request(app)
      .post('/new-db')
      .send({ url: '/some-url' });
    expect(response.status).toEqual(200);
  });

  it('deletes all databases on demand', async () => {
    await request(app)
      .post('/new-db')
      .send({ url: '/some-url' });
    await request(app)
      .post('/some-url')
      .send({ id: '1', name: 'stuff' });
    await request(app).post('/clear-dbs');
    const response = await request(app).get('/some-url/1');
    expect(response.status).toEqual(404);
  });
});

describe('Once the db is created', () => {
  const url = '/some-database';
  beforeEach(async () => {
    await request(app)
      .post('/new-db')
      .send({ url });
  });
  afterEach(async () => await request(app).post('/clear-dbs'));

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

  it('dumps everything out of the database', async () => {
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

  it('returns an empty list for an empty db', async () => {
    const response = await request(app).get(url);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
});

describe('Custom IDs', () => {
  const url = '/custom-id-db';
  afterEach(async () => await request(app).post('/clear-dbs'));
  it('accepts an id alias on creation and uses that going forward', async () => {
    await request(app)
      .post('/new-db')
      .send({ url: '/custom-id-db', idAlias: 'customerId' });

    await request(app)
      .post('/custom-id-db')
      .send({ customerId: '1', name: 'michelangelo' });

    const response = await request(app).get('/custom-id-db/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ customerId: '1', name: 'michelangelo' });
  });

  it('deletes using a custom id', async () => {
    await request(app)
      .post('/new-db')
      .send({ url, idAlias: 'customerId' });
    await request(app)
      .post(url)
      .send({ customerId: '2', name: 'michelangelo' });

    await request(app).delete(`${url}/2`);

    const response = await request(app).get(`${url}/2`);
    expect(response.status).toBe(404);
  });
});
