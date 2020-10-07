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

function getById(id) {
  return proxys.find((proxy) => proxy.id === id);
}

function updateById(id, newProxy) {
  const proxyIndex = proxys.findIndex((proxy) => proxy.id === id);
  if (proxyIndex !== -1) {
    proxys[proxyIndex] = newProxy;
    logger.silly(`Proxy ${id} successfully updated`);
    return proxys[proxyIndex];
  } else {
    logger.warn(`Attempted to update proxy with id ${id}, but couldn't find it!`);
    return undefined;
  }
}

function deleteById(id) {
  const proxyIndex = proxys.findIndex((proxy) => proxy.id === id);
  if (proxyIndex !== -1) {
    proxys.splice(proxyIndex, 1);
  } else {
    logger.warn(`Attempted to delete proxy with id ${id}, but couldn't find it!`);
  }
}

function setEnabled(id, enabled) {
  const item = getById(id);
  if (item) {
    return item.setEnabled(enabled);
  } else {
    return undefined;
  }
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
  getById,
  updateById,
  deleteById,
  setEnabled,
  all,
  clear
};
