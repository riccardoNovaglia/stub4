const express = require('express');
const router = express.Router();

const getRequestMatcher = require('./request');
const extractResponse = require('./response');
const stubs = require('../stubbing');

router.post('/new', function(req, res) {
  try {
    const request = getRequestMatcher(req);
    const response = extractResponse(req);

    stubs.add(request, response);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', (_, res) => {
  res.json(stubs.all());
});

router.post('/clear', (_, res) => {
  stubs.clearAll();
  res.end();
});

module.exports = router;