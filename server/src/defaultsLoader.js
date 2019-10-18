const fs = require('fs');
const stubs = require('./stubs');
const scenarios = require('./scenarios/routing');
const cruds = require('./cruds');

function loadDefaultsFiles(defaultsFiles) {
  defaultsFiles.forEach(defaultsFile => {
    const contents = JSON.parse(fs.readFileSync(defaultsFile, { encoding: 'utf8' }).toString());

    cruds.load(contents.cruds);
    stubs.loadFromFile(contents.stubs);
    scenarios.loadFromFile(contents.scenarios);
  });
}

module.exports = { loadDefaultsFiles };
