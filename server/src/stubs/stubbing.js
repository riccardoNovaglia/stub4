const _ = require('lodash');

const { createLogger } = require('../logger');

const stubs = [];
const sstubs = [];
const interactions = [];

const logger = createLogger('stubs');

function add(stub) {
  const existingStub = sstubs.find(existing => existing.urlMatcher.url === stub.urlMatcher.url);
  if (existingStub) removeExisting(existingStub);

  logger.info(`Created new stub ${stub.pretty()}`);
  logger.silly(`New stub: ${JSON.stringify(stub, null, 2)}`);
  sstubs.push(stub);
}

function removeExisting(stub) {
  logger.debug(`Removing existing stub ${stub.pretty()}`);
  sstubs.splice(sstubs.indexOf(stub), 1);
}

function get(url, method, body) {
  return sstubs.find(stub => stub.matches(url, method, body));
}

function getInteraction(url) {
  return interactions.find(interaction => interaction.url === url);
}

function all() {
  return sstubs;
}

function clearAll() {
  stubs.length = 0;
  sstubs.length = 0;
  interactions.length = 0;
  logger.info('All stubs cleared');
}

function count(url) {
  const interaction = getInteraction(url);
  return _.get(interaction, 'count', 0);
}

function countUp(url) {
  const interaction = getInteraction(url);
  interaction ? (interaction.count += 1) : interactions.push({ url, count: 1 });
}

module.exports = {
  add,
  all,
  clearAll,
  get,
  countUp,
  count
};
