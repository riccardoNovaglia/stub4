const request = require('supertest');
const app = require('./app');

describe('Something', () => {
    it('creates new stubs', async () => {
        const stubCreationResponse = await request(app)
            .post('/new-stub')
            .send({ requestMatchers: { url: '/john' } });
        expect(stubCreationResponse.status).toEqual(200);

        const stubbedResponse = await request(app).get('/john');
        expect(stubbedResponse.status).toEqual(200);
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
});
