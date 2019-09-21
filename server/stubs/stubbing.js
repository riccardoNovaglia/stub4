let stubs = {};

function add(request, response) {
  stubs[request.url] = {
    request,
    response
  };
}

function get(req) {
  return stubs[req.originalUrl];
}

function all() {
  return stubs;
}

function clearAll() {
  stubs = {};
}

function forEach(fn) {
  Object.keys(stubs)
    .map(url => stubs[url])
    .forEach(stub => fn(stub));
}

function items() {
  return Object.keys(stubs).map(url => stubs[url]);
}

module.exports = {
  add,
  all,
  clearAll,
  get,
  forEach,
  items
};
