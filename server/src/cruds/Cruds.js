const { createLogger } = require('../logger');

const logger = createLogger('cruds');

const cruds = [];

function add(crud) {
  logger.info(`Adding new crud ${crud.pretty()}`);
  logger.silly(crud.prettyJson());
  cruds.push(crud);
}

function get(url) {
  return cruds.find((crud) => crud.matches(url));
}

function getById(id) {
  return cruds.find((crud) => crud.id === id);
}

function updateById(id, newCrud) {
  const crudIndex = cruds.findIndex((crud) => crud.id === id);
  if (crudIndex !== -1) {
    cruds[crudIndex] = newCrud;
    logger.silly(`Crud ${id} successfully updated`);
    return cruds[crudIndex];
  } else {
    logger.warn(`Attempted to update crud with id ${id}, but couldn't find it!`);
    return undefined;
  }
}

function deleteById(id) {
  const crudIndex = cruds.findIndex((crud) => crud.id === id);
  if (crudIndex !== -1) {
    cruds.splice(crudIndex, 1);
  } else {
    logger.warn(`Attempted to delete crud with id ${id}, but couldn't find it!`);
  }
}

function all() {
  return cruds.map((crud) => crud.simple());
}

function clear() {
  cruds.length = 0;
}

module.exports = {
  add,
  get,
  getById,
  updateById,
  deleteById,
  all,
  clear
};
