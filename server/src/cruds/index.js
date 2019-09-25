const router = require('./routing/router');
const middleware = require('./routing/middleware');
const { load } = require('./stubbing');

module.exports = {
  router,
  middleware,
  load
};
