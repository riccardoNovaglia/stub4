const { BodyMatcher } = require('../BodyMatcher');

describe('A class to match bodies to scenarios', () => {
  it('matches a body when it is equal to the given', () => {
    const matcher = BodyMatcher({ value: { some: '*' } });

    expect(matcher.matches({ some: 'thing' })).toEqual(true);
  });

  it('matches a partial body when it is equal to the given', () => {
    const matcher = BodyMatcher({ value: { things: 'thing' } });

    expect(matcher.matches({ things: 'thing', stuff: 'other-stuff' })).toEqual(true);
  });

  it('rejects a body if it does not find the properties needed', () => {
    const matcher = BodyMatcher({ value: { things: 'thing' } });

    expect(matcher.matches({ stuff: 'other-stuff', more: 'other' })).toEqual(false);
  });
});
