const _ = require('lodash');
const express = require('express');

const { createLogger } = require('./logger');

module.exports = (items, builderFn, names, extra) => {
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
      return res.end();
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

  return router;
};
