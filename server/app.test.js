const request = require('supertest');
const app = require('./app');

describe('Something', () => {
    it('creates a new stub with url only, defaulting to GET, returns ok and no body', async () => {
        const stubCreationResponse = await request(app)
            .post('/new-stub')
            .send({ requestMatchers: { url: '/john' } });
        expect(stubCreationResponse.status).toEqual(200);

        const stubbedResponse = await request(app).get('/john');
        expect(stubbedResponse.status).toEqual(200);
        expect(stubbedResponse.body).toEqual({});
    });

    it('responds from the new stub with the given body', async () => {
        await request(app)
            .post('/new-stub')
            .send({
                requestMatchers: { url: '/whateva' },
                response: { body: { hey: 'you!' } }
            });

        const response = await request(app).get('/whateva');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ hey: 'you!' });
    });

    it('sets up the stub with the required method', async () => {
        await request(app)
            .post('/new-stub')
            .send({
                requestMatchers: { method: 'POST', url: '/another-one' },
                response: { body: { just: 'posted' } }
            });

        const response = await request(app).post('/another-one');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ just: 'posted' });
    });

    it('responds with the correct body format and header given a response type', async () => {
        await request(app)
            .post('/new-stub')
            .send({
                requestMatchers: { url: '/a-new-one' },
                response: { body: `hello, how's it going`, type: 'text' }
            });

        const response = await request(app).get('/a-new-one');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({});
        expect(response.text).toEqual("hello, how's it going");
        expect(response.headers).toMatchObject({
            'content-type': 'text/plain; charset=utf-8'
        });
    });
});
