const _ = require('lodash');
const axios = require('axios');
const { Pact } = require('@pact-foundation/pact');

const log = require('../logger');
const stubs = require('../stubs/stubbing');
const pactConfig = require('../config').pact;

const pactServerPort = pactConfig.serverPort;

async function generateContracts({ consumer }) {
  const stubsWithContracts = stubs.all().filter(stub => !!stub.contract);
  const providers = new Set(stubsWithContracts.map(stub => stub.contract.providerName));
  for (const provider of providers) {
    try {
      const relevantStubs = stubsWithContracts.filter(
        stub => stub.contract.providerName === provider
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

  try {
    const interactions = providerStubs.map(stub => addInteraction(pact, stub));
    await Promise.all(interactions);

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
    state: stub.contract.state,
    uponReceiving: stub.contract.uponReceiving,
    withRequest: {
      method: stub.method,
      path: stub.urlMatcher.url
    },
    willRespondWith: {
      status: stub.response.statusCode,
      headers: { 'Content-Type': stub.response.contentType },
      body: stub.response.body
    }
  });
  return callStub(pactServerPort, stub.urlMatcher.url, stub.method);
}

async function callStub(port, url, method) {
  return axios.request({ url: `http://localhost:${port}${url}`, method });
}

module.exports = {
  generateContracts
};
