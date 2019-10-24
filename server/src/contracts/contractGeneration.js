const _ = require('lodash');
const axios = require('axios');
const { Pact } = require('@pact-foundation/pact');

const log = require('../logger');
const stubs = require('../stubs/stubbing');
const pactConfig = require('../config').pact;

const pactServerPort = pactConfig.serverPort;

async function generateContracts({ consumer }) {
  const stubsWithContracts = stubs.all().filter(stub => !!stub.request.contract);
  const providers = new Set(stubsWithContracts.map(stub => stub.request.contract.providerName));
  for (const provider of providers) {
    try {
      const relevantStubs = stubsWithContracts.filter(
        stub => stub.request.contract.providerName === provider
      );
      await generateContract(consumer, provider, relevantStubs);
    } catch (e) {
      console.log(`Coudln't genrate contract between ${consumer} and ${provider}`, e);
    }
  }
}

async function generateContract(consumer, provider, providerStubs) {
  const pact = new Pact({
    consumer,
    provider,
    port: pactServerPort,
    log: pactConfig.logsDestination,
    dir: pactConfig.contractsFilesDestination,
    logLevel: pactConfig.logLevel
  });

  await pact.setup();

  const interactions = providerStubs.map(stub => addInteraction(pact, stub));
  await Promise.all(interactions);

  try {
    await pact.verify();
  } catch (e) {
    // and then what?
    log('Pact provider Verification failed', e);
  } finally {
    await pact.finalize();
  }
}

function addInteraction(pact, stub) {
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
  return callStub(pactServerPort, stub.request.url, stub.request.method);
}

async function callStub(port, url, method) {
  return axios.request({ url: `http://localhost:${port}${url}`, method });
}

module.exports = {
  generateContracts
};
