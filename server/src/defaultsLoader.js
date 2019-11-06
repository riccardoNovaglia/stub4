const fs = require('fs');
const stubs = require('./stubs/stubbing');
const { StubFromFile } = require('./stubs/Stub');

const scenarios = require('./scenarios/routing/scenarios');
const { ScenarioFromFile } = require('./scenarios/Scenario');

const cruds = require('./cruds/stubbing');
const { CrudFromFile: CrudFromFile } = require('./cruds/Crud');

const { createLogger } = require('./logger');
const logger = createLogger('load');

function loadDefaultsFiles(defaultsFiles) {
  defaultsFiles.forEach(defaultsFile => {
    const contents = JSON.parse(fs.readFileSync(defaultsFile, { encoding: 'utf8' }).toString());

    load(contents.cruds, CrudFromFile, cruds.add, 'crud');
    load(contents.stubs, StubFromFile, stubs.add, 'stub');
    load(contents.scenarios, ScenarioFromFile, scenarios.add, 'scenario');
  });
}

function load(content, buildFn, addFn, name) {
  if (!content) return;

  content.forEach(item => {
    try {
      logger.debug(`Loading ${name} ${JSON.stringify(item)}`);
      const builtItem = buildFn(item);

      addFn(builtItem);
    } catch (e) {
      logger.error(`An error occurred loading ${name} `, e);
    }
  });
}

module.exports = { loadDefaultsFiles };
