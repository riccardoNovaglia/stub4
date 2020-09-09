const express = require('express');
const router = express.Router();

const { generateContracts } = require('./contractGeneration');

router.post('/generate-pact', async (req, res) => {
  try {
    // should this publish too? or return them?
    await generateContracts({ consumer: req.body.consumer });
  } catch (e) {
    log('whops', e);
  }
  return res.end();
});

module.exports = {
  router
};
