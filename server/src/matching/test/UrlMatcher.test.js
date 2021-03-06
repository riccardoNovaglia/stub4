const { UrlMatcher } = require('../UrlMatcher');

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

    it('works with url encoded variables', () => {
      const matcher = UrlMatcher('/some-url?variable[0]=thing');

      expect(matcher.matches('/some-url?variable[0]=thing')).toEqual(true);
      expect(matcher.matches('/some-url?variable%5B0%5D=thing')).toEqual(true);
      expect(matcher.matches('/some-url?variable%5B1%5D=thing')).toEqual(false);
      expect(matcher.matches('/some-url?variable%5B0%5D=bananas')).toEqual(false);
    });

    it('works with multiple url encoded variables', () => {
      const matcher = UrlMatcher('/some-url?variable[0]=thing&variable[1]=other');

      expect(matcher.matches('/some-url?variable[0]=thing&variable[1]=other')).toEqual(true);
      expect(matcher.matches('/some-url?variable%5B0%5D=thing')).toEqual(false);
      expect(matcher.matches('/some-url?variable%5B0%5D=thing&variable%5B1%5D=other')).toEqual(
        true
      );
    });
  });

  describe('starts-with and ends-with and in-the-middle', () => {
    const startCases = [
      ['/the-start', true],
      ['/the-start-and-something', true],
      ['/the-start/and-url-path', true],
      ['/the-start?and=query', true],
      ['/the-start?and=query1&query=2', true],
      ['/something-before/the-start', false],
      ['/different', false],
      ['/the-tart', false],
      ['/the-star', false]
    ];

    it.each(startCases)(
      'matches all urls with a given start when ended with a * - %p',
      (urlToMatch, shouldMatch) => {
        const matcher = UrlMatcher('/the-start*');

        expect(matcher.matches(urlToMatch)).toEqual(shouldMatch);
      }
    );

    const endCases = [
      ['/the-end', true],
      ['/something-and/the-end', true],
      ['/something-and/another/the-end', true],
      ['/query?is-it=valid/the-end', true], // is this even a valid url?
      ['/different/completely', false],
      ['/the-nd', false],
      ['/the-en', false]
    ];

    it.each(endCases)(
      'matches all urls with a given end when started with a * - %p',
      (urlToMatch, shouldMatch) => {
        const matcher = UrlMatcher('*/the-end');

        expect(matcher.matches(urlToMatch)).toEqual(shouldMatch);
      }
    );

    const middleCases = [
      ['/the-start/the-end', true],
      ['/the-start/something-and/the-end', true],
      ['/the-start/something-and/another/the-end', true],
      ['/the-start/query?is-it=valid/the-end', true], // is this even a valid url?
      ['/different/completely/entirely', false],
      ['/the-start/different-end', false],
      ['/different-start/the-end', false]
    ];
    it.each(middleCases)(
      "matches all urls with a given start and end when there's a * in the middle - %p",
      (urlToMatch, shouldMatch) => {
        const matcher = UrlMatcher('/the-start/*/the-end');

        expect(matcher.matches(urlToMatch)).toEqual(shouldMatch);
      }
    );
  });
});
