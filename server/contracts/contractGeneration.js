const axios = require('axios');
const path = require('path');
const { Pact } = require('@pact-foundation/pact');

const log = require('../logger');
const stubs = require('../stubs/stubbing');

const pactServerPort = 9093;

async function generateContracts() {
  const provider = new Pact({
    consumer: 'consumer', // your own app?
    provider: 'provider', // their app
    port: pactServerPort, // should at least try again
    log: path.resolve(process.cwd(), 'logs', 'pact.log'), //should move or turn off?
    dir: path.resolve(process.cwd(), 'generatedTestPacts'), // make configurable
    logLevel: 'WARN' // make configurable
  });

  await provider.setup();

  const interactions = stubs.items().map(stub => {
    provider.addInteraction({
      state: `${stub.request.url} - state`,
      uponReceiving: `${stub.request.url} - uponReceiving`,
      withRequest: {
        method: stub.request.method,
        path: stub.request.url
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': stub.response.contentType },
        body: stub.response.body
      }
    });

    return callStub(pactServerPort, stub.request.url);
  });

  await Promise.all(interactions);

  try {
    await provider.verify();
  } catch (e) {
    // and then what?
    log('Pact provider Verification failed', e);
  }

  await provider.finalize();
}

async function callStub(port, url) {
  return axios.get(`http://localhost:${port}${url}`);
}

module.exports = {
  generateContracts
};
