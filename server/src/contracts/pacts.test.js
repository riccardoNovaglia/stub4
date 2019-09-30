const fs = require('fs');
const request = require('supertest');
const { app } = require('../app');

describe('Pact contracts generation for stubs', () => {
  const generatedPactFilepath = './generatedTestPacts/some-consumer-provider.json';

  beforeEach(async () => {
    try {
      fs.unlinkSync(generatedPactFilepath);
    } catch (e) {}
    await request(app).post('/stubs/clear');
  });

  it('does not generate a contract for a stub that does not have contract details setup', async () => {
    await request(app)
      .post('/stubs/new')
      .send({ requestMatcher: { url: '/john' } });

    const response = await request(app)
      .post('/generate-pact')
      .send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    expect(() =>
      JSON.parse(fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString())
    ).toThrowError(/no such file or directory/);
  });

  it('generates a contract for the stub created', async () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    await request(app)
      .post('/stubs/new')
      .send({ requestMatcher: { url: '/john' }, contract: { state, uponReceiving } });

    const response = await request(app)
      .post('/generate-pact')
      .send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(aPact('/john', state, uponReceiving));
  });

  it('generates a contract just for the stub with the contract details set', async () => {
    const state = 'some other state';
    const uponReceiving = 'upon whatevere';
    await request(app)
      .post('/stubs/new')
      .send({ requestMatcher: { url: '/some-url' }, contract: { state, uponReceiving } });
    await request(app)
      .post('/stubs/new')
      .send({ requestMatcher: { url: '/some-other-url' } });

    const response = await request(app)
      .post('/generate-pact')
      .send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(aPact('/some-url', state, uponReceiving));
  });
});

function aPact(url, state, uponReceiving) {
  return {
    consumer: {
      name: 'some-consumer'
    },
    provider: {
      name: 'provider'
    },
    interactions: [
      {
        description: uponReceiving,
        providerState: state,
        request: {
          method: 'GET',
          path: url
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
