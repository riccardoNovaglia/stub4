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

module.exports = {
  add,
  all,
  clearAll,
  get
};
