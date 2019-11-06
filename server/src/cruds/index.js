const middleware = require('./middleware');

const cruds = require('./stubbing');
const { crudFromRequest } = require('./Crud');

const router = require('../router')(cruds, crudFromRequest, { many: 'cruds', one: 'crud' });

module.exports = {
  router,
  middleware
};
