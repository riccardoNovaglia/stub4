const _ = require('lodash');
const axios = require('axios');
const { Pact } = require('@pact-foundation/pact');

const log = require('../logger');
const stubs = require('../stubs/stubbing');
const pactConfig = require('../config').pact;

const pactServerPort = pactConfig.serverPort;

async function generateContracts({ consumer }) {
  const pact = new Pact({
    consumer,
    provider: 'provider', // their app
    port: pactServerPort,
    log: pactConfig.logsDestination,
    dir: pactConfig.contractsFilesDestination,
    logLevel: pactConfig.logLevel
  });

  await pact.setup();

  const interactions = stubs.all().map(stub => {
    if (!_.isEmpty(stub.request.contract)) {
      pact.addInteraction({
        state: stub.request.contract.state,
        uponReceiving: stub.request.contract.uponReceiving,
        withRequest: {
          method: stub.request.method,
          path: stub.request.url
        },
        willRespondWith: {
          status: stub.response.statusCode,
          headers: { 'Content-Type': stub.response.contentType },
          body: stub.response.body
        }
      });

      return callStub(pactServerPort, stub.request.url);
    }
  });

  await Promise.all(interactions);

  try {
    await pact.verify();
  } catch (e) {
    // and then what?
    log('Pact provider Verification failed', e);
  }

  await pact.finalize();
}

async function callStub(port, url) {
  return axios.get(`http://localhost:${port}${url}`);
}

module.exports = {
  generateContracts
};
