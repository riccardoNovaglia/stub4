const _ = require('lodash');
const { log } = require('../../logger');
const stubs = require('../stubbing');

const { StubFromFile } = require('../Stub');

function loadFromFile(staticStubs) {
  if (!staticStubs) return;

  staticStubs.forEach(stub => {
    try {
      const builtStub = StubFromFile(stub);

      stubs.add(builtStub);
    } catch (e) {
      log(e);
    }
  });
}

module.exports = loadFromFile;
