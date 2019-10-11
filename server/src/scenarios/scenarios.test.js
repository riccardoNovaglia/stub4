const request = require('supertest');
const { app } = require('../app');

describe('Configuring scenarios', () => {
  it('creates a new stub with url only, defaulting to GET, returns ok and no body', async () => {
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
          response: { body: { hey: 'default dude!' } }
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
});
