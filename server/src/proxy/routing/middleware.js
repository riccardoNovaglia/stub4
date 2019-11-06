const proxy = require('../proxying');

const { createLogger } = require('../../logger');

const logger = createLogger('proxy');

async function middleware(req, res, next) {
  try {
    const url = req.originalUrl;

    const response = await proxy.get(url);
    if (response) {
      return res.status(response.status).send(response.data);
    } else {
      return next();
    }
  } catch (e) {
    logger.error(`An error occurred proxying ${req.originalUrl}: `, e);
    return next();
  }
}

module.exports = middleware;
