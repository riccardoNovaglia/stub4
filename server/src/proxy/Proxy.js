const _ = require('lodash');

function Proxy(url, method, proxyUrl) {
  return {
    request: { url, method },
    proxyUrl
  };
}

function ProxyFromRequest(req) {
  const method = _.get(req.body, 'requestMatcher.method', 'GET');
  const url = _.get(req.body, 'requestMatcher.url');
  const proxyUrl = _.get(req.body, 'proxy.destination.url');

  if (!url) throw new Error('A request matcher url must be provided!');
  if (!proxyUrl) throw new Error('A url to proxy to must be provided!');

  return Proxy(url, method, proxyUrl);
}

module.exports = { ProxyFromRequest, Proxy };
