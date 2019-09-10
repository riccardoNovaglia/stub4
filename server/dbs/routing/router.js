const express = require('express');
const router = express.Router();

const _ = require('lodash');

const dbs = require('../stubbing');

router.get('/', (req, res) => {
  const data = Object.keys(dbs.meta.idAliases).map(dbUrl => ({
    url: dbUrl,
    idAlias: dbs.meta.getAlias(dbUrl)
  }));

  res.json(data);
});

router.post('/new', function(req, res) {
  const url = _.get(req.body, 'url');
  const idAlias = _.get(req.body, 'idAlias', 'id');
  dbs.addDb(url, idAlias);
  return res.end();
});

router.post('/clear', function(req, res) {
  dbs.clearAll();
  return res.end();
});

module.exports = router;
