const express = require('express');

const interactions = require('./interactions');
const { startWebsocket } = require('./websocket');

const router = express.Router();

router.get('/interactions', (_, res) => {
  const { websocketPort } = startWebsocket();
  res.send({ interactions: interactions.getInteractions(), websocketPort });
});

module.exports = {
  router
};
