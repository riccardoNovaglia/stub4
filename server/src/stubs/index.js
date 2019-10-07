const router = require('./routing/router');
const middleware = require('./routing/middleware');
const loadFromFile = require('./fileLoad/fileLoad');

module.exports = {
  router,
  middleware,
  loadFromFile
};
