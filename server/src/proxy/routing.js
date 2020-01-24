const proxy = require('./Proxys');

const { ProxyFromRequest } = require('./Proxy');
const router = require('../router')(proxy, ProxyFromRequest, { many: 'proxy', one: 'proxy' });

const { createLogger } = require('../logger');

const logger = createLogger('proxy');

async function middleware(req, res, next) {
  try {
    const url = req.originalUrl;
    const method = req.method;

    const response = await proxy.get(url, method, req.body);
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

module.exports = { middleware, router };
