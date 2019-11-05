const express = require('express');
const router = express.Router();

const { createLogger } = require('../../logger');
const unmatched = require('../unmatched');

const logger = createLogger('unmatched');

router.get('/unmatched', (_, res) => {
  const allUnmatched = unmatched.all();
  return res.json(allUnmatched);
});

router.delete('/unmatched', (_, res) => {
  unmatched.clear();
  logger.info('Cleared all unmatched requests');
  return res.end();
});

module.exports = router;
