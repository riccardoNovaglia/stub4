const stubs = {};

function addStub(request, response) {
  stubs[request.url] = response;
}

function getStub(req) {
  return stubs[req.originalUrl];
}

module.exports = {
  addStub,
  getStub
};
