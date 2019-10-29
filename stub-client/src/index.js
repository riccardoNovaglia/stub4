const { StubClient, Stub, get, post } = require('./StubClient');
const { ScenariosClient } = require('./ScenariosClient');
const { CrudClient } = require('./CrudClient');
const { ProxyClient } = require('./ProxyClient');
const { ContractsClient } = require('./ContractsClient');
const { UnmatchedClient } = require('./UnmatchedClient');

const stubs = { StubClient, Stub, get, post };

module.exports = {
  ...stubs,
  ScenariosClient,
  ProxyClient,
  CrudClient,
  ContractsClient,
  UnmatchedClient
};
