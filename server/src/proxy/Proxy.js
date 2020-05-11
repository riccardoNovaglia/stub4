const axios = require('axios');
const _ = require('lodash');

const { createLogger } = require('../logger');

const { RequestMatcher } = require('../matching/RequestMatcher');

const logger = createLogger('proxy');

function Proxy(requestMatcher, proxyUrl) {
  if (!proxyUrl) throw new Error('A url to proxy to must be provided!');

  return {
    proxyUrl,
    requestMatcher,
    matches(url, method, headers, body) {
      return this.requestMatcher.matches({ url, method, headers, body });
    },
    async doProxy(method, headers, body) {
      logger.debug(`Proxying request to ${method} ${this.proxyUrl}`);
      const response = await axios.request({
        url: this.proxyUrl,
        method,
        headers,
        data: body
      });
      logger.debug(`Received response from proxy'd url: ${response}`);
      return response;
    },
    pretty() {
      return `${this.requestMatcher.methodMatcher.pretty()} ${this.requestMatcher.urlMatcher.pretty()} -> ${proxyUrl}`;
    },
    toJson() {
      return {
        requestMatcher: this.requestMatcher.toJson(),
        proxyUrl
      };
    }
  };
}

function ProxyFromRequest(req) {
  const requestMatcher = RequestMatcher(req.body.requestMatcher);
  const proxyUrl = _.get(req.body, 'proxy.destination.url');

  return Proxy(requestMatcher, proxyUrl);
}

function ProxyFromFile(proxyDef) {
  const requestMatcher = RequestMatcher(proxyDef.requestMatcher);
  const proxyUrl = _.get(proxyDef, 'destination.url');

  return Proxy(requestMatcher, proxyUrl);
}

module.exports = { ProxyFromRequest, ProxyFromFile, Proxy };
