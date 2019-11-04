const express = require('express');
const router = express.Router();

const { log } = require('../../logger');
const unmatched = require('../unmatched');

router.get('/unmatched', (_, res) => {
  const allUnmatched = unmatched.all();
  return res.json(allUnmatched);
});

router.delete('/unmatched', (_, res) => {
  unmatched.clear();
  return res.end();
});

module.exports = router;
