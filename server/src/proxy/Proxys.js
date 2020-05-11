const axios = require('axios');
const { createLogger } = require('../logger');

const logger = createLogger('proxy');

const proxys = [];

function add(proxy) {
  logger.info(`Adding new proxy ${proxy.pretty()}`);
  proxys.push(proxy);
}

function get(url, method, headers, body) {
  logger.debug(`Trying to get proxy for ${url}`);
  return proxys.find((proxy) => proxy.matches(url, method, headers, body));
}

function all() {
  return proxys.map((proxy) => proxy.toJson());
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
