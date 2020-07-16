const fs = require('fs');
const request = require('supertest');
const app = require('../app');

describe.skip('Pact contracts generation for stubs', () => {
  const generatedPactFilepath = './generatedTestPacts/some-consumer-some-provider.json';

  beforeEach(async () => {
    try {
      fs.unlinkSync(generatedPactFilepath);
    } catch (e) {}
    await request(app).delete('/stubs');
  });

  it('does not generate a contract for a stub that does not have contract details setup', async () => {
    await request(app)
      .post('/stubs')
      .send({ requestMatcher: { url: '/john' } });

    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
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
      .post('/stubs')
      .send({ requestMatcher: { url: '/john' }, contract: { state, uponReceiving, providerName } });

    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(
      aPactWithStructure({ url: '/john' }, { state, uponReceiving, providerName })
    );
  });

  it('generates a contract just for the stub with the contract details set', async () => {
    const state = 'some other state';
    const uponReceiving = 'upon whatevere';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/some-url' },
        contract: { state, uponReceiving, providerName }
      });
    await request(app)
      .post('/stubs')
      .send({ requestMatcher: { url: '/some-other-url' } });

    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(
      aPactWithStructure({ url: '/some-url' }, { state, uponReceiving, providerName })
    );
  });

  it('plays the interaction with the right method', async () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/john', method: 'POST' },
        contract: { state, uponReceiving, providerName }
      });

    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(
      aPactWithStructure({ url: '/john', method: 'POST' }, { state, uponReceiving, providerName })
    );
  });

  it('sets up the right body given the stub response body', async () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/stuff' },
        response: { body: { msg: `hello, how's it going` } },
        contract: { state, uponReceiving, providerName }
      });

    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(
      aPactWithStructure(
        { url: '/stuff', body: { msg: `hello, how's it going` } },
        { state, uponReceiving, providerName }
      )
    );
  });

  it('sets up the right status code', async () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/stuff' },
        response: { body: { msg: `hello, how's it going` }, statusCode: 404 },
        contract: { state, uponReceiving, providerName }
      });

    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(
      aPactWithStructure(
        { url: '/stuff', body: { msg: `hello, how's it going` }, statusCode: 404 },
        { state, uponReceiving, providerName }
      )
    );
  });

  it('sets up the right content type', async () => {
    const state = 'in a given state';
    const uponReceiving = 'receiving some request';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/stuff' },
        response: {
          body: `hello, how's it going`,
          type: 'text'
        },
        contract: { state, uponReceiving, providerName }
      });

    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact).toEqual(
      aPactWithStructure(
        { url: '/stuff', body: `hello, how's it going`, contentType: 'text/plain' },
        { state, uponReceiving, providerName }
      )
    );
  });

  it('sets up multiple interactions for the same provider', async () => {
    const state1 = 'in a given state 123';
    const uponReceiving1 = 'receiving some request 123';
    const state2 = 'in a given state 321';
    const uponReceiving2 = 'receiving some request 321';
    const providerName = 'some-provider';
    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/stuff' },
        response: {
          body: `hello, how's it going`,
          type: 'text'
        },
        contract: { state: state1, uponReceiving: uponReceiving1, providerName }
      });

    await request(app)
      .post('/stubs')
      .send({
        requestMatcher: { url: '/another-url', method: 'POST' },
        response: {
          body: { mgs: 'this be json' },
          statusCode: 404
        },
        contract: { state: state2, uponReceiving: uponReceiving2, providerName }
      });
    const response = await request(app).post('/generate-pact').send({ consumer: 'some-consumer' });
    expect(response.statusCode).toEqual(200);

    const pact = JSON.parse(
      fs.readFileSync(generatedPactFilepath, { encoding: 'utf8' }).toString()
    );

    expect(pact.consumer).toEqual({ name: 'some-consumer' });
    expect(pact.provider).toEqual({ name: providerName });
    expect(pact.interactions).toEqual(
      expect.arrayContaining([
        {
          description: uponReceiving1,
          providerState: state1,
          request: {
            method: 'GET',
            path: '/stuff'
          },
          response: {
            status: 200,
            headers: {
              'Content-Type': 'text/plain'
            },
            body: `hello, how's it going`
          },
          metadata: null
        },
        {
          description: uponReceiving2,
          providerState: state2,
          request: {
            method: 'POST',
            path: '/another-url'
          },
          response: {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            },
            body: { mgs: 'this be json' }
          },
          metadata: null
        }
      ])
    );
  });

  describe('multiple providers', () => {
    const contract1 = './generatedTestPacts/some-consumer-some-provider1.json';
    const contract2 = './generatedTestPacts/some-consumer-some-provider2.json';
    beforeEach(async () => {
      try {
        fs.unlinkSync(contract1);
        fs.unlinkSync(contract2);
      } catch (e) {}
      await request(app).delete('/stubs');
    });

    it('generates a contract for each different provider-consumer pair', async () => {
      const state = 'some other state';
      const uponReceiving = 'upon whatevere';
      const providerName1 = 'some-provider1';
      const providerName2 = 'some-provider2';
      await request(app)
        .post('/stubs')
        .send({
          requestMatcher: { url: '/some-url' },
          contract: { state, uponReceiving, providerName: providerName1 }
        });
      await request(app)
        .post('/stubs')
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

      expect(pact1).toEqual(
        aPactWithStructure(
          { url: '/some-url' },
          { state, uponReceiving, providerName: providerName1 }
        )
      );
      expect(pact2).toEqual(
        aPactWithStructure(
          { url: '/some-other-url' },
          { state, uponReceiving, providerName: providerName2 }
        )
      );
    });
  });
});

function aPactWithStructure(
  { url, method = 'GET', body = {}, statusCode = 200, contentType = 'application/json' },
  { state, uponReceiving, providerName }
) {
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
          status: statusCode,
          headers: {
            'Content-Type': contentType
          },
          body
        },
        metadata: null
      }
    ],
    metadata: {
      pactSpecification: {
        version: '2.0.0'
      }
    }
  };
}

function aPactWithMultipleInteractions(theInteractions, providerName) {
  const interactions = theInteractions.map((interaction) => ({
    description: interaction.uponReceiving,
    providerState: interaction.state,
    request: {
      method: interaction.method,
      path: interaction.url
    },
    response: {
      status: interaction.statusCode,
      headers: {
        'Content-Type': interaction.contentType
      },
      body: interaction.body
    }
  }));

  return {
    consumer: {
      name: 'some-consumer'
    },
    provider: {
      name: providerName
    },
    interactions,
    metadata: {
      pactSpecification: {
        version: '2.0.0'
      }
    }
  };
}
