const _ = require('lodash');

let stubs = {};
let interactions = {};

function add(request, response) {
  stubs[request.url] = {
    request,
    response
  };
}

function get(url) {
  return stubs[url];
}

function all() {
  return stubs;
}

function clearAll() {
  stubs = {};
  interactions = {};
}

function forEach(fn) {
  Object.keys(stubs)
    .map(url => stubs[url])
    .forEach(stub => fn(stub));
}

function items() {
  return Object.keys(stubs).map(url => stubs[url]);
}

function count(url) {
  return _.get(interactions[url], 'count', 0);
}

function countUp(url) {
  interactions[url] = {
    count: count(url) + 1
  };
}

module.exports = {
  add,
  all,
  clearAll,
  get,
  forEach,
  items,
  countUp,
  count
};
