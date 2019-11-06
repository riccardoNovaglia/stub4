const middleware = require('./middleware');

const stubs = require('./stubbing');
const { StubFromRequest } = require('./Stub');

const router = require('../router')(stubs, StubFromRequest, { many: 'stubs', one: 'stub' });

router.get('/count', (req, res) => {
  const url = req.body.url;

  const count = stubs.count(url);
  return res.send({ count });
});

module.exports = {
  router,
  middleware
};
