const express = require('express');
const router = express.Router();

const scenarios = require('./scenarios');
const { ScenarioFromRequest } = require('../Scenario');

router.post('/new', function(req, res) {
  try {
    const scenario = ScenarioFromRequest(req);

    scenarios.add(scenario);

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
