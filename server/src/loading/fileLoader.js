const fs = require('fs');
const glob = require('glob');

const stubs = require('../stubs/Stubs');
const { StubFromFile } = require('../stubs/Stub');

const scenarios = require('../scenarios/Scenarios');
const { ScenarioFromFile } = require('../scenarios/Scenario');

const cruds = require('../cruds/Cruds');
const { CrudFromFile } = require('../cruds/Crud');

const proxy = require('../proxy/Proxys');
const { ProxyFromFile } = require('../proxy/Proxy');

const { createLogger } = require('../logger');
const logger = createLogger('load');

function loadDefaultsFiles(defaultsFiles) {
  defaultsFiles.forEach((defaultsFile) => {
    if (defaultsFile.includes('*')) {
      glob(defaultsFile, {}, function (_er, files) {
        files.forEach((filename) => loadFromFile(filename));
      });
    } else {
      loadFromFile(defaultsFile);
    }
  });
}

function loadFromFile(filename) {
  const contents = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }).toString());

  load(contents.cruds, CrudFromFile, cruds.add, 'crud');
  load(contents.stubs, StubFromFile, stubs.add, 'stub');
  load(contents.scenarios, ScenarioFromFile, scenarios.add, 'scenario');
  load(contents.proxy, ProxyFromFile, proxy.add, 'proxy');
}

function load(content, buildFn, addFn, name) {
  if (!content) return;

  content.forEach((item) => {
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
