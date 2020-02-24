const { HeadersMatcher } = require('../HeadersMatcher');

describe('A class to match headers to request headers', () => {
  it('matches any request when built with no requirements', () => {
    const matcher = HeadersMatcher(undefined);

    expect(matcher.matches({})).toEqual(true);
    expect(matcher.matches({ abc: 'cde' })).toEqual(true);
  });

  it('only matches when a list of required headers is given', () => {
    const matcher = HeadersMatcher({ abc: 'cde' });

    expect(matcher.matches({})).toEqual(false);
    expect(matcher.matches({ abc: 'cde' })).toEqual(true);
    expect(matcher.matches({ abc: 'cde', bcd: 'dsa' })).toEqual(true);
  });

  it('disregards the case of the keys, but not of the values', () => {
    const matcher = HeadersMatcher({ SOME_THING: 'a-value' });

    expect(matcher.matches({ some_thing: 'a-value' })).toEqual(true);
    expect(matcher.matches({ some_thing: 'A-VALUE' })).toEqual(false);
    expect(matcher.matches({ SOME_THING: 'A-VALUE' })).toEqual(false);
    expect(matcher.matches({ SOME_THING: 'a-value' })).toEqual(true);
    expect(matcher.matches({ SoMe_ThInG: 'a-value' })).toEqual(true);
    expect(matcher.matches({ SoMe_THING: 'A-VALUE' })).toEqual(false);
  });
});
