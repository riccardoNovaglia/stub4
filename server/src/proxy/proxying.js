const proxys = [];

function addProxy(request, proxyUrl) {
  proxys.push({
    request,
    proxyUrl
  });
}

function get(url) {
  return proxys.filter(proxy => proxy.request.url === url)[0].proxyUrl;
}

module.exports = {
  addProxy,
  get
};
