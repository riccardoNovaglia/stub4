const { has } = require('lodash');
const { StubFromJs } = require('../stubs/Stub');
const Stubs = require('../stubs/Stubs');

const { CrudFromJs } = require('../cruds/Crud');
const Cruds = require('../cruds/Cruds');

const { ScenarioFromJs } = require('../scenarios/Scenario');
const Scenarios = require('../scenarios/Scenarios');

const { ProxyFromJs } = require('../proxy/Proxy');
const Proxys = require('../proxy/Proxys');

const { createLogger } = require('../logger');

const logger = createLogger('loader');

function add(items) {
  items.forEach((item) => {
    if (has(item, 'response')) return Stubs.add(StubFromJs(item));
    else if (has(item, 'proxy')) return Proxys.add(ProxyFromJs(item));
    else if (has(item, 'crud')) return Cruds.add(CrudFromJs(item));
    else if (has(item, 'scenarios')) return Scenarios.add(ScenarioFromJs(item));
    else {
      logger.warn(
        `Couldn't load one of the items from js because it didn't look like any of the supported types: \n${JSON.stringify(
          item
        )}`
      );
    }
  });
}

module.exports = {
  add
};
