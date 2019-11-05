const express = require('express');
const router = express.Router();

const _ = require('lodash');

const cruds = require('../stubbing');
const { createLogger } = require('../../logger');
const { crudFromRequest } = require('../Crud');

const logger = createLogger('cruds');

router.get('/', (_, res) => {
  const all = cruds.all();
  return res.json(all);
});

router.post('/new', function(req, res) {
  try {
    const crud = crudFromRequest(req);
    cruds.add(crud);
    return res.end();
  } catch (e) {
    logger.error('An error occurred creating a crud', e);
    return res.sendStatus(500);
  }
});

router.post('/clear', function(_, res) {
  logger.info('Clearing all cruds');
  cruds.clearAll();
  return res.end();
});

module.exports = router;
