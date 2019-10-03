const _ = require('lodash');
const express = require('express');
const router = express.Router();

const getRequestMatcher = require('./request');
const proxy = require('../proxying');

router.post('/new', function(req, res) {
  try {
    const request = getRequestMatcher(req);
    const proxyUrl = req.body.proxy.destination.url;
    proxy.addProxy(request, proxyUrl);
    return res.end();
  } catch (e) {
    return res.status(500).end();
  }
});

router.get('/', function(_, res) {
  res.json(proxy.all());
});

router.delete('/', function(_, res) {
  proxy.clear();
  res.end();
});

module.exports = router;
