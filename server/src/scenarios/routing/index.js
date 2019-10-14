const router = require('./router');
const middleware = require('./middleware');
const loadFromFile = require('../fileLoad/fileLoad');

module.exports = {
  router,
  middleware,
  loadFromFile
};
