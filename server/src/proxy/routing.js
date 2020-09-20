const { createLogger } = require('../logger');
const interactions = require('../interactions/interactions');
const proxys = require('./Proxys');

const { ProxyFromRequest } = require('./Proxy');

const router = require('../router')({
  items: proxys,
  builderFn: ProxyFromRequest,
  names: { many: 'proxy', one: 'proxy' }
});

const logger = createLogger('proxy');

async function middleware(req, res, next) {
  const { originalUrl, method, headers, body, rawBody } = req;
  try {
    const proxy = await proxys.get(originalUrl, method, headers, body);
    if (proxy) {
      interactions.addInteraction({ ...proxy.toJson(), type: 'proxy' });
      const response = await proxy.doProxy(method, headers, rawBody ? rawBody : body);
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
