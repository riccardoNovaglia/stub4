const middleware = require('./routing/middleware');

const proxy = require('./proxying');
const { ProxyFromRequest } = require('./Proxy');
const router = require('../router')(proxy, ProxyFromRequest, { many: 'proxy', one: 'proxy' });

module.exports = {
  router,
  middleware
};
