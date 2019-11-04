const { log } = require('../logger');

let cruds = {};

const meta = {
  idAliases: {},
  getAlias(url) {
    return this.idAliases[url].idAlias || 'id';
  },
  pushAlias(url, idAlias) {
    this.idAliases[url] = { idAlias };
  },
  reset() {
    this.idAliases = {};
  }
};

function addCrud(url, idAlias) {
  log(`Added crud for ${url} with idAlias ${idAlias}`);

  cruds[url] = {};
  meta.pushAlias(url, idAlias);
}

function clearAll() {
  cruds = {};
  meta.reset();
}

function load(cruds) {
  if (!cruds) return;

  cruds.forEach(crud => {
    const { meta, data } = crud;
    const idAlias = meta.idAlias || 'id';

    addCrud(meta.url, idAlias);

    data.forEach(item => push(meta.url, item[idAlias], item));
  });
}

function push(url, id, item) {
  cruds[url][id] = item;
}

function getAll(crudUrl) {
  const matchedCrud = cruds[crudUrl];
  if (matchedCrud) {
    return Object.keys(matchedCrud).map(id => matchedCrud[id]);
  } else {
    throw new Error('CRUD not found');
  }
}

function get(url, id) {
  const matchedCrud = cruds[url];
  const item = matchedCrud[id];
  if (item) {
    return item;
  } else {
    throw new Error('Item not found');
  }
}

function remove(url, id) {
  delete cruds[url][id];
}

module.exports = {
  addCrud,
  clearAll,
  load,

  remove,
  get,
  getAll,
  push,
  meta
};
