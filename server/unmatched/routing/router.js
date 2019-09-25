const express = require('express');
const router = express.Router();

const log = require('../../logger');
const unmatched = require('../unmatched');

router.get('/unmatched', (_, res) => {
  const allUnmatched = unmatched.all();
  res.json(allUnmatched);
});

router.delete('/unmatched', (_, res) => {
  unmatched.clear();
  res.end();
});

module.exports = router;
