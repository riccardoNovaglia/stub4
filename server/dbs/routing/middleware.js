const log = require('../../logger');
const { getAll, get, push, remove, meta } = require('../stubbing');

function middleware(req, res, next) {
  try {
    switch (req.method) {
      case 'GET':
        return getItem(req, res);
      case 'POST':
        return pushItem(req, res);
      case 'DELETE':
        return deleteItem(req, res);
      default:
        return next();
    }
  } catch (e) {
    log(e);
  } finally {
    next();
  }
}

function getItem(req, res) {
  try {
    const url = urlFrom(req);
    const items = getAll(url);
    return res.json(items);
  } catch (e) {
    try {
      const { url, id } = urlIdFrom(req);
      const item = get(url, id);
      return res.json(item);
    } catch (e) {
      log(e);
    }
  }
}
function pushItem(req, res) {
  const { url, id } = extractPushItemMeta(req);
  const item = req.body;
  push(url, id, item);
  return res.status(200).end();
}
function deleteItem(req, res) {
  const { url, id } = urlIdFrom(req);
  remove(url, id);
  return res.status(200).end();
}

function extractPushItemMeta(req) {
  const url = req.originalUrl;
  const idAlias = meta.getAlias(url);
  const id = req.body[idAlias];
  return { url, id };
}

function urlIdFrom(req) {
  const urlParts = req.originalUrl.split('/');
  const id = urlParts.pop();
  const url = urlParts.join('/');
  return { url, id };
}

function urlFrom(req) {
  const urlParts = req.originalUrl.split('/');
  return `/${urlParts.pop()}`;
}

module.exports = middleware;
