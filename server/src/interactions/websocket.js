const WebSocket = require('ws');

const { createLogger } = require('../logger');
const { cli } = require('winston/lib/winston/config');
const logger = createLogger('interactionsWebsocket');

let websocketServer = null;
let websocketPort = null;
let socket = null;
function startWebsocket() {
  if (websocketPort !== null) return { websocketPort };

  websocketServer = new WebSocket.Server({ port: 0 });
  websocketPort = websocketServer.address().port;
  logger.debug(`Started websocket on port ${websocketPort}`);

  websocketServer.on('connection', (ws) => {
    logger.debug('websocket connected');
    socket = ws;
  });
  websocketServer.on('close', () => {
    logger.debug('websocket closed');
    socket = null;
    websocketPort = null;
  });
  return {
    websocketPort
  };
}

function send(item) {
  try {
    if (socket === null) {
      logger.silly('No websocket connected yet, skipping');
      return;
    }
    socket.send(JSON.stringify(item));
  } catch (e) {
    logger.debug(`An error occurred trying to send interaction. ${e}`, e);
  }
}

module.exports = {
  startWebsocket,
  send
};
