const _ = require('lodash');

const { createLogger } = require('../logger');

const stubs = [];
const interactions = [];

const logger = createLogger('stubs');

function add(stub) {
  // TODO: see about using id instead?
  const existingStub = stubs.find((existing) => existing.equals(stub));
  if (existingStub) removeExisting(existingStub);

  logger.info(`Created new stub ${stub.pretty()}`);
  logger.silly(`New stub: ${JSON.stringify(stub, null, 2)}`);
  stubs.push(stub);
}

function removeExisting(stub) {
  logger.debug(`Removing existing stub ${stub.pretty()}`);
  stubs.splice(stubs.indexOf(stub), 1);
}

function get(url, method, headers, body) {
  return stubs.find((stub) => stub.matches(url, method, headers, body));
}

function getInteraction(url) {
  return interactions.find((interaction) => interaction.url === url);
}

function getById(id) {
  return stubs.find((stub) => stub.id === id);
}

function updateById(id, newStub) {
  const stubIndex = stubs.findIndex((stub) => stub.id === id);
  if (stubIndex !== -1) {
    stubs[stubIndex] = newStub;
    logger.silly(`Stub ${id} successfully updated`);
    return stubs[stubIndex];
  } else {
    logger.warn(`Attempted to update stub with id ${id}, but couldn't find it!`);
    return undefined;
  }
}

function deleteById(id) {
  const stubIndex = stubs.findIndex((stub) => stub.id === id);
  if (stubIndex !== -1) {
    stubs.splice(stubIndex, 1);
  } else {
    logger.warn(`Attempted to delete stub with id ${id}, but couldn't find it!`);
  }
}

function all() {
  return stubs.map((stub) => stub.toJson());
}

function clear() {
  stubs.length = 0;
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
  clear,
  get,
  getById,
  updateById,
  deleteById,
  countUp,
  count
};
