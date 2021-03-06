const { createLogger } = require('../logger');
const websocket = require('./websocket');

const logger = createLogger('interactions');

const interactions = [];

function addInteraction(item) {
  const matchedInteraction = { matched: true, item };
  interactions.push(matchedInteraction);
  logger.debug(`Interaction with ${JSON.stringify(item)} added to recorded`);
  websocket.send(matchedInteraction);
}

function addUnmatched(url, method, headers, body) {
  const requestDetails = { url, method, headers, body };
  const unmatchedInteraction = { matched: false, requestDetails };
  interactions.push(unmatchedInteraction);
  logger.debug(`Unmatched ${JSON.stringify(requestDetails)} added to recorded`);
  websocket.send(unmatchedInteraction);
}

function getInteractions() {
  return interactions;
}

function clear() {
  interactions.length = 0;
}

module.exports = {
  addInteraction,
  addUnmatched,
  getInteractions,
  clear
};
