const fs = require('fs');
const request = require('supertest');
const { app } = require('./app');

describe('Pact contracts generation for stubs', () => {
  const generatedPactFilepath = './generatedTestPacts/consumer-provider.json';

  beforeAll(() => {
    try {
      fs.unlinkSync(generatedPactFilepath);
    } catch (e) {}
  });

  it('generates a contract for the stub created', async () => {
    await request(app)
      .post('/stubs/new')
      .send({ requestMatcher: { url: '/john' } });

    const response = await request(app).post('/generate-pact');
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(aPact());
  });
});

function aPact() {
  return {
    consumer: {
      name: 'consumer'
    },
    provider: {
      name: 'provider'
    },
    interactions: [
      {
        description: '/john - uponReceiving',
        providerState: '/john - state',
        request: {
          method: 'GET',
          path: '/john'
        },
        response: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {}
        }
      }
    ],
    metadata: {
      pactSpecification: {
        version: '2.0.0'
      }
    }
  };
}
