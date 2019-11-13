const _ = require('lodash');
const axios = require('axios');
const { Pact } = require('@pact-foundation/pact');

const { createLogger } = require('../logger');
const stubs = require('../stubs/Stubs');
const pactConfig = require('../config').pact;

const pactServerPort = pactConfig.serverPort;

const logger = createLogger('contracts');

async function generateContracts({ consumer }) {
  const stubsWithContracts = stubs.all().filter(stub => !!stub.contract);
  const providers = new Set(stubsWithContracts.map(stub => stub.contract.providerName));
  for (const provider of providers) {
    try {
      const relevantStubs = stubsWithContracts.filter(
        stub => stub.contract.providerName === provider
      );
      logger.info(`${relevantStubs.length} stubs with contracts setup found. Generating...`);
      await generateContract(consumer, provider, relevantStubs);
      logger.info(`Contracts generated in ${pactConfig.contractsFilesDestination}`);
    } catch (e) {
      logger.error(`An error occurred generating contract between ${consumer} and ${provider}`, e);
    }
  }
}

async function generateContract(consumer, provider, providerStubs) {
  logger.debug(
    `Starting Pact on port ${pactServerPort} to generate contracts between ${consumer} and ${provider}`
  );
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
    logger.warn(`Pact verification failed between ${consumer} and ${provider}: `, e);
  } finally {
    await pact.finalize();
  }
}

async function addInteraction(pact, stub) {
  logger.debug(`Adding interaction for ${stub.prettyJson()}`);
  await pact.addInteraction({
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
  try {
    return await axios.request({ url: `http://localhost:${port}${url}`, method });
  } catch (e) {
    logger.debug(`Calling stub at ${url} returned exception. This might be expected: `, e);
  }
}

module.exports = {
  generateContracts
};
