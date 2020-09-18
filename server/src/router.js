const _ = require('lodash');
const express = require('express');

const { createLogger } = require('./logger');

module.exports = ({ items, builderFn, names, extra }) => {
  const router = express.Router();

  const logger = createLogger(names.many);

  router.get('/', (_, res) => {
    const all = items.all();
    return res.json(all);
  });

  router.post('/', (req, res) => {
    try {
      logger.silly(`Building ${names.one} out of ${JSON.stringify(req.body, null, 2)}`);
      const item = builderFn(req);

      items.add(item);
      return res.json(item.toJson());
    } catch (e) {
      logger.error(`An error occurred creating a ${names.one}: `, e);
      return res.sendStatus(500);
    }
  });

  router.delete('/', (_, res) => {
    logger.info(`Clearing all ${names.many}`);
    items.clear();
    return res.end();
  });

  router.get('/:id', (req, res) => {
    const item = items.getById(req.params.id);
    if (item) {
      return res.json(item.toJson());
    } else {
      return res.sendStatus(404);
    }
  });

  router.post('/:id', (req, res) => {
    const item = items.updateById(req.params.id, builderFn(req));
    if (item) {
      return res.json(item.toJson());
    } else {
      return res.sendStatus(404);
    }
  });

  router.delete('/:id', (req, res) => {
    logger.debug(`Trying to delete item by id ${req.params.id}`);
    items.deleteById(req.params.id);
    return res.sendStatus(200);
  });

  return router;
};
