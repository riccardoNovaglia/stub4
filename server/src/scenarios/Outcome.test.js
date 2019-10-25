const Outcome = require('./Outcome');

describe('an outcome', () => {
  it('matches a given body if the required property is found and matched', () => {
    const outcome = Outcome({ match: { id: 1 }, response: { body: {} } }, {});

    expect(outcome.matchesBody({ id: 1 })).toEqual(true);
  });

  it('does not match a given body if the required property is found but not matched', () => {
    const outcome = Outcome({ match: { id: 1 }, response: { body: {} } }, {});

    expect(outcome.matchesBody({ id: 2 })).toEqual(false);
  });

  it('matches a given body if the required property is found and matched, and other properties are present', () => {
    const outcome = Outcome({ match: { id: 1 }, response: { body: {} } }, {});

    expect(outcome.matchesBody({ id: 1, other: 'thing' })).toEqual(true);
  });

  it('does not match a given body if the required property is found but not matched, and other properties are present', () => {
    const outcome = Outcome({ match: { id: 1 }, response: { body: {} } }, {});

    expect(outcome.matchesBody({ id: 55, other: 'thing' })).toEqual(false);
  });

  it('matches a given body if all required properties are found and matched', () => {
    const outcome = Outcome({ match: { id: 1, bananas: 2 }, response: { body: {} } }, {});

    expect(outcome.matchesBody({ id: 1, bananas: 2 })).toEqual(true);
  });

  it('does not match a given body if some properties are not matched', () => {
    const outcome = Outcome({ match: { id: 1, bananas: 2 }, response: { body: {} } }, {});

    expect(outcome.matchesBody({ id: 1, bananas: 33 })).toEqual(false);
  });

  it('does not match a given body if some properties are not found', () => {
    const outcome = Outcome({ match: { id: 1, bananas: 2 }, response: { body: {} } }, {});

    expect(outcome.matchesBody({ id: 1 })).toEqual(false);
  });
});
