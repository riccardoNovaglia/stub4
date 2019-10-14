const scenarios = require('../routing/scenarios');
const loadFromFile = require('./fileLoad');

describe('Loading stubs from an initialiser file', () => {
  afterEach(scenarios.clearAll);

  it('creates a scenario from some file', () => {
    loadFromFile([
      {
        matching: { url: '/dude/{id}' },
        outcomes: [{ id: 1, response: { body: { hey: 'dude number 1!' } } }],
        default: {
          response: { body: { hey: 'setup default' }, statusCode: 200 }
        }
      }
    ]);

    const dude1 = scenarios.get('/dude/1');
    expect(dude1.statusCode).toEqual(200);
    expect(dude1.body).toEqual({ hey: 'dude number 1!' });

    const dude3 = scenarios.get('/dude/3');
    expect(dude3.statusCode).toEqual(200);
    expect(dude3.body).toEqual({ hey: 'setup default' });
  });

  it('loads multiple scenarios', () => {
    loadFromFile([
      {
        matching: { url: '/dude/{id}' },
        outcomes: [{ id: 1, response: { body: { hey: 'other' } } }],
        default: {
          response: { body: { hey: 'some' }, statusCode: 200 }
        }
      },
      {
        matching: { url: '/other/{bananas}' },
        outcomes: [{ bananas: 'yes', response: { body: {} } }],
        default: {
          response: { body: { hey: 'no bananas' }, statusCode: 404 }
        }
      }
    ]);

    const dude1 = scenarios.get('/dude/1');
    expect(dude1.statusCode).toEqual(200);
    expect(dude1.body).toEqual({ hey: 'other' });

    const dude3 = scenarios.get('/dude/3');
    expect(dude3.statusCode).toEqual(200);
    expect(dude3.body).toEqual({ hey: 'some' });

    const yesBananas = scenarios.get('/other/yes');
    expect(yesBananas.statusCode).toEqual(200);
    expect(yesBananas.body).toEqual({});

    const noBananas = scenarios.get('/other/no');
    expect(noBananas.statusCode).toEqual(404);
    expect(noBananas.body).toEqual({ hey: 'no bananas' });
  });
});
