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

function all() {
  return proxys;
}

function clear() {
  proxys.length = 0;
}

module.exports = {
  addProxy,
  get,
  all,
  clear
};
