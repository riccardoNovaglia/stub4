const { getAll, get, push, deletes } = require('../stubbing');

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

module.exports = middleware;
