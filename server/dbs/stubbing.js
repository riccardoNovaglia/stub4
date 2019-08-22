let dbs = {};

function addDb(url) {
  dbs[url] = {};
}

function middleware(req, res, next) {
  try {
    const matchedStub = dbs[req.originalUrl];
    return res.status(404).end();
  } catch (e) {
    next();
  }
}

module.exports = {
  addDb,
  middleware
};
