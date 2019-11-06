const express = require('express');
const router = express.Router();

const { createLogger } = require('../logger');
const unmatched = require('./Unmatched');

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

function middleware(req, _, next) {
  unmatched.addUnmatch(req.originalUrl, req.method);
  logger.info(
    `'${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}' didn't match any existing stub`
  );
  return next();
}

module.exports = { router, middleware };
