const { get, add, clear } = require('../Scenarios');
const { ScenarioFromFile } = require('../Scenario');

describe('Loading stubs from an initialiser file', () => {
  afterEach(clear);

  it('creates a scenario from some file', () => {
    add(
      ScenarioFromFile({
        requestMatcher: { url: '/dude/{id}' },
        outcomes: [{ match: { id: 1 }, response: { body: { hey: 'dude number 1!' } } }],
        default: {
          response: { body: { hey: 'setup default' }, statusCode: 200 }
        }
      })
    );

    const dude1 = get('/dude/1');
    const dude1Response = dude1.getResponse('/dude/1', {});
    expect(dude1Response.statusCode).toEqual(200);
    expect(dude1Response.body).toEqual({ hey: 'dude number 1!' });

    const dude3 = get('/dude/3');
    const dude3Response = dude3.getResponse('/dude/3', {});
    expect(dude3Response.statusCode).toEqual(200);
    expect(dude3Response.body).toEqual({ hey: 'setup default' });
  });

  it('creates a scenario from file with body matching', () => {
    add(
      ScenarioFromFile({
        requestMatcher: {
          url: '/other-things',
          body: { bodyMatch: { something: '*' } }
        },
        outcomes: [
          { match: { something: 'ok' }, response: { body: { the: 'other' }, statusCode: 302 } }
        ],
        default: {
          response: { body: {}, statusCode: 404 }
        }
      })
    );

    const matched = get('/other-things', undefined, undefined, { something: 'ok' });
    const matchedResponse = matched.getResponse('/other-things', { something: 'ok' });
    expect(matchedResponse.statusCode).toEqual(302);
    expect(matchedResponse.body).toEqual({ the: 'other' });

    const unmatched = get('/other-things', undefined, undefined, { something: 'not this' });
    const unmatchedResponse = unmatched.getResponse('/other-things', { something: 'not this' });
    expect(unmatchedResponse.statusCode).toEqual(404);
    expect(unmatchedResponse.body).toEqual({});
  });

  it('loads multiple scenarios', () => {
    add(
      ScenarioFromFile({
        requestMatcher: { url: '/dude/{id}' },
        outcomes: [{ match: { id: 1 }, response: { body: { hey: 'other' } } }],
        default: {
          response: { body: { hey: 'some' }, statusCode: 200 }
        }
      })
    );
    add(
      ScenarioFromFile({
        requestMatcher: { url: '/other/{bananas}' },
        outcomes: [{ match: { bananas: 'yes' }, response: { body: {} } }],
        default: {
          response: { body: { hey: 'no bananas' }, statusCode: 404 }
        }
      })
    );
    add(
      ScenarioFromFile({
        requestMatcher: {
          url: '/other-things',
          body: { bodyMatch: { something: '*' } }
        },
        outcomes: [
          { match: { something: 'ok' }, response: { body: { the: 'other' }, statusCode: 302 } }
        ],
        default: {
          response: { body: {} }
        }
      })
    );

    const dude1 = get('/dude/1');
    const dude1Response = dude1.getResponse('/dude/1', {});
    expect(dude1Response.statusCode).toEqual(200);
    expect(dude1Response.body).toEqual({ hey: 'other' });

    const dude3 = get('/dude/3');
    const dude3Response = dude3.getResponse('/dude/3', {});
    expect(dude3Response.statusCode).toEqual(200);
    expect(dude3Response.body).toEqual({ hey: 'some' });

    const yesBananas = get('/other/yes');
    const yesBananasResponse = yesBananas.getResponse('/other/yes', {});
    expect(yesBananasResponse.statusCode).toEqual(200);
    expect(yesBananasResponse.body).toEqual({});

    const noBananas = get('/other/no');
    const noBananasResponse = noBananas.getResponse('/other/no', {});
    expect(noBananasResponse.statusCode).toEqual(404);
    expect(noBananasResponse.body).toEqual({ hey: 'no bananas' });

    const other = get('/other-things', undefined, undefined, {
      something: 'ok',
      irrelevant: 'yes'
    });
    const otherResponse = other.getResponse('/other-things', {
      something: 'ok',
      irrelevant: 'yes'
    });
    expect(otherResponse.statusCode).toEqual(302);
    expect(otherResponse.body).toEqual({ the: 'other' });
  });
});
