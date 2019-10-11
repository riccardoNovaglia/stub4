const _ = require('lodash');

const stubs = [];
const interactions = [];

function add(request, response) {
  const newStub = { request, response };
  const stub = get(request.url);
  if (stub) {
    stub.request = newStub.request;
    stub.response = newStub.response;
  } else {
    stubs.push(newStub);
  }
}

// TODO: match method, headers
function get(url, method = 'GET') {
  return stubs.find(stub => stub.request.url === url && stub.request.method === method);
}

function getInteraction(url) {
  return interactions.find(interaction => interaction.url === url);
}

function all() {
  return stubs;
}

function clearAll() {
  stubs.length = 0;
  interactions.length = 0;
}

function forEach(fn) {
  stubs.forEach(stub => fn(stub));
}

function count(url) {
  const interaction = getInteraction(url);
  return _.get(interaction, 'count', 0);
}

function countUp(url) {
  const interaction = getInteraction(url);
  interaction ? (interaction.count += 1) : interactions.push({ url, count: 1 });
}

module.exports = {
  add,
  all,
  clearAll,
  get,
  forEach,
  countUp,
  count
};
