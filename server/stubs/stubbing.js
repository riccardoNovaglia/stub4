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

function middleware(req, res, next) {
  try {
    const matchedStub = get(req);
    return res
      .set('Content-Type', matchedStub.response.contentType)
      .send(matchedStub.response.body);
  } catch (e) {
    next();
  }
}

module.exports = {
  add,
  all,
  clearAll,
  get,
  middleware
};
