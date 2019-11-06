const axios = require('axios');
const { createLogger } = require('../logger');

const logger = createLogger('proxy');

const proxys = [];

function add(proxy) {
  proxys.push(proxy);
}

async function get(url) {
  logger.debug(`Trying to get proxy for ${url}`);
  const proxy = proxys.find(proxy => proxy.request.url === url);
  if (!proxy) return undefined;

  logger.debug(`Proxying request to ${proxy.proxyUrl}`);
  const response = await axios.get(proxy.proxyUrl);

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
