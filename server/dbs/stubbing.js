let dbs = { idAliases: {} };

function addDb(url, idAlias) {
  dbs[url] = {};
  dbs.idAliases[url] = { idAlias };
}

function clearAll() {
  dbs = { idAliases: {} };
}

function push(req, res) {
  const dbUrl = req.originalUrl;
  const idAlias = dbs.idAliases[dbUrl].idAlias;
  const itemId = req.body[idAlias];
  dbs[dbUrl][itemId] = req.body;
  return res.status(200).end();
}

function getAll(req, res, next) {
  const urlParts = req.originalUrl.split('/');
  const dbUrl = `/${urlParts.pop()}`;
  if (Object.keys(dbs).some(url => url === dbUrl)) {
    const matchedDb = dbs[dbUrl];
    return res.json(Object.keys(matchedDb).map(id => matchedDb[id]));
  } else {
    return next();
  }
}

function get(req, res) {
  const { dbUrl, itemId } = dbAndItem(req);
  const matchedDb = dbs[dbUrl];
  const item = matchedDb[itemId];
  if (item) {
    return res.json(item);
  } else {
    return res.status(404).end();
  }
}

function deletes(req, res) {
  const { dbUrl, itemId } = dbAndItem(req);
  delete dbs[dbUrl][itemId];
  return res.status(200).end();
}

function middleware(req, res, next) {
  try {
    if (req.method === 'GET') {
      return getAll(req, res, () => {
        return get(req, res);
      });
    } else if (req.method === 'POST') {
      return push(req, res);
    } else if (req.method === 'DELETE') {
      return deletes(req, res);
    }
  } catch (e) {
  } finally {
    next();
  }
}

function dbAndItem(req) {
  const urlParts = req.originalUrl.split('/');
  const itemId = urlParts.pop();
  const dbUrl = urlParts.join('/');
  return { dbUrl, itemId };
}

module.exports = {
  addDb,
  clearAll,
  middleware
};
