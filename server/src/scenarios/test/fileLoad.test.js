const { get, add, clear } = require('../Scenarios');
const { ScenarioFromFile } = require('../Scenario');

describe('Loading stubs from an initialiser file', () => {
  afterEach(clear);

  it('creates a scenario from some file', () => {
    add(
      ScenarioFromFile({
        matching: { url: '/dude/{id}' },
        outcomes: [{ match: { id: 1 }, response: { body: { hey: 'dude number 1!' } } }],
        default: {
          response: { body: { hey: 'setup default' }, statusCode: 200 }
        }
      })
    );

    const dude1 = get('/dude/1');
    expect(dude1.statusCode).toEqual(200);
    expect(dude1.body).toEqual({ hey: 'dude number 1!' });

    const dude3 = get('/dude/3');
    expect(dude3.statusCode).toEqual(200);
    expect(dude3.body).toEqual({ hey: 'setup default' });
  });

  it('loads multiple scenarios', () => {
    add(
      ScenarioFromFile({
        matching: { url: '/dude/{id}' },
        outcomes: [{ match: { id: 1 }, response: { body: { hey: 'other' } } }],
        default: {
          response: { body: { hey: 'some' }, statusCode: 200 }
        }
      })
    );
    add(
      ScenarioFromFile({
        matching: { url: '/other/{bananas}' },
        outcomes: [{ match: { bananas: 'yes' }, response: { body: {} } }],
        default: {
          response: { body: { hey: 'no bananas' }, statusCode: 404 }
        }
      })
    );
    add(
      ScenarioFromFile({
        matching: { url: '/other-things', body: { something: '*' } },
        outcomes: [
          { match: { something: 'ok' }, response: { body: { the: 'other' }, statusCode: 302 } }
        ],
        default: {
          response: { body: {} }
        }
      })
    );

    const dude1 = get('/dude/1');
    expect(dude1.statusCode).toEqual(200);
    expect(dude1.body).toEqual({ hey: 'other' });

    const dude3 = get('/dude/3');
    expect(dude3.statusCode).toEqual(200);
    expect(dude3.body).toEqual({ hey: 'some' });

    const yesBananas = get('/other/yes');
    expect(yesBananas.statusCode).toEqual(200);
    expect(yesBananas.body).toEqual({});

    const noBananas = get('/other/no');
    expect(noBananas.statusCode).toEqual(404);
    expect(noBananas.body).toEqual({ hey: 'no bananas' });

    const other = get('/other-things', { something: 'ok', irrelevant: 'yes' });
    expect(other.statusCode).toEqual(302);
    expect(other.body).toEqual({ the: 'other' });
  });
});
