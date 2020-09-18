const express = require('express');

const { createLogger } = require('../logger');
const interactions = require('./interactions');
const { startWebsocket } = require('./websocket');

const logger = createLogger('interactions');

const router = express.Router();

router.get('/interactions', (_, res) => {
  const { websocketPort } = startWebsocket();
  res.send({ interactions: interactions.getInteractions(), websocketPort });
});

function middleware(req, _, next) {
  interactions.addUnmatched(req.originalUrl, req.method, req.headers, req.body);
  logger.info(
    `'${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}' didn't match any existing stub`
  );
  return next();
}

module.exports = {
  router,
  middleware
};
