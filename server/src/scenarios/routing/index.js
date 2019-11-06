const middleware = require('./middleware');
const loadFromFile = require('../fileLoad/fileLoad');

const scenarios = require('./scenarios');
const { ScenarioFromRequest } = require('../Scenario');

const router = require('../../router')(scenarios, ScenarioFromRequest, {
  many: 'scenarios',
  one: 'scenario'
});

module.exports = {
  router,
  middleware,
  loadFromFile
};
