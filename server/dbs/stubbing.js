let dbs = {};

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

function addDb(url, idAlias) {
  dbs[url] = {};
  meta.pushAlias(url, idAlias);
}

function clearAll() {
  dbs = {};
  meta.reset();
}

function load(dbs) {
  dbs.forEach(db => {
    const { meta, data } = db;
    const idAlias = meta.idAlias || 'id';

    addDb(meta.url, idAlias);

    data.forEach(item => push(meta.url, item[idAlias], item));
  });
}

function push(url, id, item) {
  dbs[url][id] = item;
}

function getAll(dbUrl) {
  const matchedDb = dbs[dbUrl];
  if (matchedDb) {
    return Object.keys(matchedDb).map(id => matchedDb[id]);
  } else {
    throw new Error('DB not found');
  }
}

function get(url, id) {
  const matchedDb = dbs[url];
  const item = matchedDb[id];
  if (item) {
    return item;
  } else {
    throw new Error('Item not found');
  }
}

function remove(url, id) {
  delete dbs[url][id];
}

module.exports = {
  addDb,
  clearAll,
  load,

  remove,
  get,
  getAll,
  push,
  meta
};
