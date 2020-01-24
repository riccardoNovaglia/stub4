const axios = require('axios');
const { createLogger } = require('../logger');

const logger = createLogger('proxy');

const proxys = [];

function add(proxy) {
  logger.info(`Adding new proxy ${proxy.pretty()}`);
  proxys.push(proxy);
}

async function get(url, method, body) {
  logger.debug(`Trying to get proxy for ${url}`);
  const proxy = proxys.find(proxy => proxy.request.url === url && proxy.request.method === method);
  if (!proxy) return undefined;

  logger.debug(`Proxying request to ${proxy.request.method} ${proxy.proxyUrl}`);
  const response = await axios.request({
    url: proxy.proxyUrl,
    method: proxy.request.method,
    data: body
  });
  logger.debug(`Received response from proxy'd url: ${response}`);

  return response;
}

function all() {
  return proxys;
}

function clear() {
  proxys.length = 0;
}

module.exports = {
  add,
  get,
  all,
  clear
};
