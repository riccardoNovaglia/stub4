const stub4 = require('./index');

// why does this log?
stub4.addItems([
  {
    requestMatcher: { url: '/something' },
    response: { body: 'ok' }
  }
]);

stub4.startup({ ui: true, logLevel: 'info' });
