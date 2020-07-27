const stub4 = require('../src/index');

stub4.addItems([
  {
    requestMatcher: { url: '/nonsense' },
    banana: {}
  },
  {
    requestMatcher: { url: '/some/url' },
    response: { body: { msg: 'ok!', now: new Date('2020-07-24').toISOString() } }
  },
  {
    requestMatcher: { url: '/now' },
    response: { body: { msg: 'ok!', now: new Date().toISOString() } }
  }
]);

const { listeningPort } = stub4.startup({ port: 10000, logLevel: 'warn' });
console.log('started on', listeningPort);
