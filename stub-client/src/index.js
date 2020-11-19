const { StubClient, Stub, get, post } = require('./StubClient');
const { ScenariosClient } = require('./ScenariosClient');
const { CrudClient } = require('./CrudClient');
const { ProxyClient } = require('./ProxyClient');
const { ContractsClient } = require('./ContractsClient');
const interactions = require('./interactions');
const { stubbings } = require('./stubbings');

const { stubFor, setPort } = require('./stubFor');

const stubsItems = {
  StubClient,
  Stub,
  get,
  post,
  stubs: stubbings('stubs'),
  scenarios: stubbings('scenarios'),
  proxy: stubbings('proxy'),
  cruds: stubbings('cruds')
};

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
