const axios = require('axios');
const _ = require('lodash');
const { v4: uuid } = require('uuid');

const { createLogger } = require('../logger');

const { RequestMatcher } = require('../matching/RequestMatcher');

const logger = createLogger('proxy');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function Proxy({ id = uuid(), enabled = true, requestMatcher, proxy }) {
  const { destinationUrl, delay } = proxy;
  if (!destinationUrl) throw new Error('A url to proxy to must be provided!');

  return {
    id,
    enabled,
    requestMatcher,
    destinationUrl,
    delay,
    matches(url, method, headers, body) {
      if (!this.enabled) return false;
      return this.requestMatcher.matches({ url, method, headers, body });
    },
    async doProxy(method, headers, body) {
      logger.debug(`Proxying request to ${method} ${this.destinationUrl}`);
      const response = await axios.request({
        url: this.destinationUrl,
        method,
        headers,
        data: body
      });
      logger.debug(`Received response from proxy'd url: ${this.responseSummary(response)}`);

      if (this.delay) {
        logger.debug(`This proxy has a delay set, sleeping for ${this.delay}ms`);
        await sleep(this.delay);
      }

      return response;
    },
    pretty() {
      const prettyMethod = this.requestMatcher.methodMatcher.pretty();
      const prettyUrl = this.requestMatcher.urlMatcher.pretty();
      const delayIfAny = this.delay ? `(+ ${this.delay}ms delay)` : '';
      return `${prettyMethod} ${prettyUrl} -> ${destinationUrl} ${delayIfAny}`;
    },
    toJson() {
      return {
        id: this.id,
        enabled: this.enabled,
        requestMatcher: this.requestMatcher.toJson(),
        proxy: { destinationUrl }
      };
    },
    responseSummary(response) {
      return `${response.status} - ${JSON.stringify(response.data)}`;
    },
    setEnabled(enabled) {
      this.enabled = enabled;
      return this.enabled;
    }
  };
}

function ProxyFromRequest(req) {
  const { id, enabled, requestMatcher, proxy } = req.body;

  return Proxy({ id, enabled, requestMatcher: RequestMatcher(requestMatcher), proxy });
}

function ProxyFromFile(proxyDef) {
  const { id, enabled, requestMatcher, proxy } = proxyDef;

  return Proxy({ id, enabled, requestMatcher: RequestMatcher(requestMatcher), proxy });
}

function ProxyFromJs(proxyDef) {
  const { id, enabled, requestMatcher, proxy } = proxyDef;

  return Proxy({ id, enabled, requestMatcher: RequestMatcher(requestMatcher), proxy });
}

module.exports = { ProxyFromRequest, ProxyFromFile, ProxyFromJs, Proxy };
