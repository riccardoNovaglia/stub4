const express = require('express');
const router = express.Router();

const extractMatching = require('./matching');
const extractOutcomes = require('./outcomes');
const scenarios = require('../scenarios');

router.post('/new', function(req, res) {
  try {
    const matching = extractMatching(req);
    const { defaultResponse, outcomes } = extractOutcomes(req);

    scenarios.add(matching, defaultResponse, outcomes);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', (_, res) => {
  return res.json(scenarios.all());
});

router.post('/clear', (_, res) => {
  scenarios.clearAll();
  return res.end();
});

// router.post('/count', (req, res) => {
//   const url = req.body.url;

//   const count = scenarios.count(url);
//   return res.send({ count });
// });

module.exports = router;
