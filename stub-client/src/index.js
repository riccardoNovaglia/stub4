const { StubClient, Stub, get, post } = require('./StubClient');
const { ScenariosClient } = require('./ScenariosClient');
const { CrudClient } = require('./CrudClient');
const { ProxyClient } = require('./ProxyClient');
const { ContractsClient } = require('./ContractsClient');
const interactions = require('./interactions');
const stubs = require('./stubs');
const scenarios = require('./scenarios');
const proxy = require('./proxys');
const cruds = require('./cruds');

const { stubFor, setPort } = require('./stubFor');

const stubsItems = { StubClient, Stub, get, post, stubs, scenarios, proxy, cruds };

module.exports = {
  ...stubsItems,
  ...interactions,
  ScenariosClient,
  ProxyClient,
  CrudClient,
  ContractsClient,
  stubFor,
  setPort
};
