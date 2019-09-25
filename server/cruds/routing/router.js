const express = require('express');
const router = express.Router();

const _ = require('lodash');

const cruds = require('../stubbing');

router.get('/', (req, res) => {
  const data = Object.keys(cruds.meta.idAliases).map(crudUrl => ({
    url: crudUrl,
    idAlias: cruds.meta.getAlias(crudUrl)
  }));

  return res.json(data);
});

router.post('/new', function(req, res) {
  const url = _.get(req.body, 'url');
  const idAlias = _.get(req.body, 'idAlias', 'id');
  cruds.addCrud(url, idAlias);
  return res.end();
});

router.post('/clear', function(req, res) {
  cruds.clearAll();
  return res.end();
});

module.exports = router;
