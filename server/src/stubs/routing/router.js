const express = require('express');
const router = express.Router();

const stubs = require('../stubbing');

const { StubFromRequest } = require('../Stub');

router.post('/new', function(req, res) {
  try {
    const stub = StubFromRequest(req);

    stubs.add(stub);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', (_, res) => {
  return res.json(stubs.all());
});

router.post('/clear', (_, res) => {
  stubs.clearAll();
  return res.end();
});

// TODO: GET?!
router.post('/count', (req, res) => {
  const url = req.body.url;

  const count = stubs.count(url);
  return res.send({ count });
});

module.exports = router;
