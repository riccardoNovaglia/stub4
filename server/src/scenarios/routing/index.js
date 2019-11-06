const middleware = require('./middleware');

const scenarios = require('./scenarios');
const { ScenarioFromRequest } = require('../Scenario');

const router = require('../../router')(scenarios, ScenarioFromRequest, {
  many: 'scenarios',
  one: 'scenario'
});

module.exports = {
  router,
  middleware
};
