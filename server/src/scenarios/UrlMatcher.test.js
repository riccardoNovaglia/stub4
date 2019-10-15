const UrlMatcher = require('./UrlMatcher');

describe('A class to match urls to scenarios', () => {
  describe('Building up a regex and variableNames for values to be pulled from urls', () => {
    it('returns a regex that will match the variables in a url', () => {
      const regex = new RegExp('/some-url/(.*)', 'g');

      const matcher = UrlMatcher('/some-url/{someVariable}');
      expect(matcher.regex).toEqual(regex);
      expect(matcher.variableNames).toEqual(['someVariable']);
    });

    it('returns a regex that will match the variables in a query string', () => {
      const regex = new RegExp('/some-url\\?some-variable=(.*)', 'g');

      const matcher = UrlMatcher('/some-url?some-variable={some-variable}');

      expect(matcher.regex).toEqual(regex);
      expect(matcher.variableNames).toEqual(['some-variable']);
    });

    it('works in the middle of urls', () => {
      const regex = new RegExp('/together/(.*)/other-stuff', 'g');

      const matcher = UrlMatcher('/together/{middle}/other-stuff');

      expect(matcher.regex).toEqual(regex);
      expect(matcher.variableNames).toEqual(['middle']);
    });

    it('works with multiple values to be captured', () => {
      const regex = new RegExp('/together/(.*)/other-stuff\\?something=(.*)', 'g');

      const matcher = UrlMatcher('/together/{first}/other-stuff?something={second}');

      expect(matcher.regex).toEqual(regex);
      expect(matcher.variableNames).toEqual(['first', 'second']);
    });
  });

  describe('Pulling values out of a url given a regex and the variable names', () => {
    it('returns all captured values given a regex and a string', () => {
      const matcher = UrlMatcher('/many?things={things}&other-things={other-things}');

      const groups = matcher.getMatchedMap('/many?things=yes&other-things=yes');

      expect(groups).toEqual([{ things: 'yes' }, { 'other-things': 'yes' }]);
    });

    it('returns all captured values given a regex and a string - 2', () => {
      const matcher = UrlMatcher('/many?things={things}&other-things={other-things}');

      const groups = matcher.getMatchedMap('/many?things=no&other-things=yes');

      expect(groups).toEqual([{ things: 'no' }, { 'other-things': 'yes' }]);
    });

    it('works in the middle of urls', () => {
      const matcher = UrlMatcher('/together/{middle}/other-stuff');

      const groups = matcher.getMatchedMap('/together/in-the-middle/other-stuff');

      expect(groups).toEqual([{ middle: 'in-the-middle' }]);
    });
  });

  describe('More match tests', () => {
    const testCases = [
      ['/together?some={some}&other={other}', '/together?some=ok&other=nope', true],
      ['/together?some={some}&other={other}', '/together?some=ok', false],
      ['/together?some={some}&other={other}', '/together?other=nope', false],
      ['/together/{middle}/other-stuff', '/together/in-the-middle/other-stuff', true],
      ['/{start}', '/begin', true]
    ];

    it.each(testCases)(
      'returns whether a url matches the regex and variables - %p',
      (urlVariablesDefinition, urlToMatch, shouldMatch) => {
        const matcher = UrlMatcher(urlVariablesDefinition);

        const didMatch = matcher.matches(urlToMatch);

        expect(didMatch).toEqual(shouldMatch);
      }
    );
  });

  describe('Simple matcher', () => {
    it('return a simple matcher if the url does not contain any variables', () => {
      const matcher = UrlMatcher('/some-url');

      expect(matcher.matches('/some-url')).toEqual(true);
      expect(matcher.matches('/some-other-url')).toEqual(false);
    });
  });
});
