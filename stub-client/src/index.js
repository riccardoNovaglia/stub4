const { StubClient, Stub, get, post } = require('./StubClient');
const { ScenariosClient } = require('./ScenariosClient');
const { CrudClient } = require('./CrudClient');
const { ProxyClient } = require('./ProxyClient');
const { ContractsClient } = require('./ContractsClient');
const { UnmatchedClient } = require('./UnmatchedClient');
const interactions = require('./interactions');

const { stubFor, setPort } = require('./stubFor');

const stubs = { StubClient, Stub, get, post };

module.exports = {
  ...stubs,
  ...interactions,
  ScenariosClient,
  ProxyClient,
  CrudClient,
  ContractsClient,
  UnmatchedClient,
  stubFor,
  setPort
};
