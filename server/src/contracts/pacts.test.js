const fs = require('fs');
const request = require('supertest');
const app = require('../app');

describe('Pact contracts generation for stubs', () => {
  const generatedPactFilepath = './generatedTestPacts/some-consumer-some-provider.json';

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
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs/new')
      .send({ requestMatcher: { url: '/john' }, contract: { state, uponReceiving, providerName } });

    const response = await request(app)
      .post('/generate-pact')
      .send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(aPact('/john', state, uponReceiving, providerName));
  });

  it('generates a contract just for the stub with the contract details set', async () => {
    const state = 'some other state';
    const uponReceiving = 'upon whatevere';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs/new')
      .send({
        requestMatcher: { url: '/some-url' },
        contract: { state, uponReceiving, providerName }
      });
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

    expect(pact).toEqual(aPact('/some-url', state, uponReceiving, providerName));
  });

  it('plays the interaction with the right method', async () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs/new')
      .send({
        requestMatcher: { url: '/john', method: 'POST' },
        contract: { state, uponReceiving, providerName }
      });

    const response = await request(app)
      .post('/generate-pact')
      .send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(aPact('/john', state, uponReceiving, providerName, 'POST'));
  });

  describe('multiple providers', () => {
    const contract1 = './generatedTestPacts/some-consumer-some-provider1.json';
    const contract2 = './generatedTestPacts/some-consumer-some-provider2.json';
    beforeEach(async () => {
      try {
        fs.unlinkSync(contract1);
        fs.unlinkSync(contract2);
      } catch (e) {}
      await request(app).post('/stubs/clear');
    });

    it('generates a contract for each different provider-consumer pair', async () => {
      const state = 'some other state';
      const uponReceiving = 'upon whatevere';
      const providerName1 = 'some-provider1';
      const providerName2 = 'some-provider2';
      await request(app)
        .post('/stubs/new')
        .send({
          requestMatcher: { url: '/some-url' },
          contract: { state, uponReceiving, providerName: providerName1 }
        });
      await request(app)
        .post('/stubs/new')
        .send({
          requestMatcher: { url: '/some-other-url' },
          contract: { state, uponReceiving, providerName: providerName2 }
        });

      const response = await request(app)
        .post('/generate-pact')
        .send({ consumer: 'some-consumer' });
      expect(response.statusCode).toEqual(200);
      const pact1 = JSON.parse(
        fs
          .readFileSync(contract1, {
            encoding: 'utf8'
          })
          .toString()
      );
      const pact2 = JSON.parse(
        fs
          .readFileSync(contract2, {
            encoding: 'utf8'
          })
          .toString()
      );

      expect(pact1).toEqual(aPact('/some-url', state, uponReceiving, providerName1));
      expect(pact2).toEqual(aPact('/some-other-url', state, uponReceiving, providerName2));
    });
  });
});

function aPact(url, state, uponReceiving, providerName, method = 'GET') {
  return {
    consumer: {
      name: 'some-consumer'
    },
    provider: {
      name: providerName
    },
    interactions: [
      {
        description: uponReceiving,
        providerState: state,
        request: {
          method,
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
