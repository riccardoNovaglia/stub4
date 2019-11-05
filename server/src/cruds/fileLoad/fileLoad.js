const _ = require('lodash');
const { log } = require('../../logger');
const cruds = require('../stubbing');

const { crudFromFile } = require('../Crud');

function loadFromFile(staticCruds) {
  if (!staticCruds) return;

  staticCruds.forEach(crud => {
    try {
      const builtCrud = crudFromFile(crud);

      cruds.add(builtCrud);
    } catch (e) {
      log(e);
    }
  });
}

module.exports = loadFromFile;
