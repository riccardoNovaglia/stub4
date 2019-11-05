const { createLogger } = require('../logger');

const logger = createLogger('cruds');

const cruds = [];

function add(crud) {
  logger.info(`Adding new crud ${crud.pretty()}`);
  logger.silly(crud.prettyJson());
  cruds.push(crud);
}

function get(url, method, body) {
  const maybeCrud = cruds.find(crud => crud.matches(url));
  if (!maybeCrud) return undefined;

  switch (method) {
    case 'GET':
      if (maybeCrud.mightHaveIdFor(url)) return maybeCrud.getItem(url);
      else return maybeCrud.allItems();
    case 'POST':
      return maybeCrud.push(body);
    case 'DELETE':
      return maybeCrud.delete(url);
    default:
      break;
  }
}

function all() {
  return cruds.map(crud => crud.simple());
}

function clearAll() {
  cruds.length = 0;
}

module.exports = {
  add,
  get,
  all,
  clearAll
};
