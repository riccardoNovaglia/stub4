const _ = require('lodash');

const stubs = [];
const sstubs = [];
const interactions = [];

function add(stub) {
  const existingStub = sstubs.find(existing => existing.urlMatcher.url === stub.urlMatcher.url);
  if (existingStub) {
    sstubs.splice(sstubs.indexOf(existingStub), 1);
  }

  sstubs.push(stub);
}

function get(url, method, body) {
  // console.log('getting', url, method, body);
  return sstubs.find(stub => stub.matches(url, method, body));
}

function getInteraction(url) {
  return interactions.find(interaction => interaction.url === url);
}

function all() {
  return sstubs;
}

function clearAll() {
  stubs.length = 0;
  sstubs.length = 0;
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
