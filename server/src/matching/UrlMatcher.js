function UrlMatcher(url) {
  if (!url) throw new Error('A request matcher url must be provided!');

  const findVariablesInCurlies = /\{([^}]+)\}/g;
  const capturedGroups = url.match(findVariablesInCurlies);
  if (!capturedGroups) return SimpleMatcher(url.trim());

  const variableNames = capturedGroups.map((group) => group.replace('{', '').replace('}', ''));

  var regexedUrl = url;
  variableNames.forEach((subVal) => (regexedUrl = regexedUrl.replace(`{${subVal}}`, '(.*)')));
  const escapedRegexedUrl = regexedUrl.replace('?', '\\?');
  const regex = new RegExp(escapedRegexedUrl, 'g');

  function getMatchedGroups(regex, string) {
    const matchedGroups = string.match(regex.source);

    return matchedGroups ? matchedGroups.slice(1) : [];
  }

  return {
    url,
    regex,
    variableNames,
    matches(url) {
      const capturedGroups = getMatchedGroups(regex, url);

      return capturedGroups.length === variableNames.length;
    },
    getMatchedMap(url) {
      const capturedGroups = getMatchedGroups(regex, url);
      const zipped = variableNames.map((elem, index) => ({ [elem]: capturedGroups[index] }));
      return zipped;
    },
    equals(otherMatcher) {
      return otherMatcher.url === this.url;
    },
    pretty() {
      return regex.toString();
    },
    toJson() {
      return {
        url: this.url,
        urlMatcher: {
          url: this.url,
          regex: this.regex.toString(),
          variableNames: this.variableNames
        }
      };
    }
  };
}

const SimpleMatcher = (url) => {
  return {
    url,
    matches: (urlToMatch) => urlToMatch === url,
    getMatchedMap: () => undefined,
    equals: (otherMatcher) => otherMatcher.url === url,
    pretty: () => url,
    toJson: () => ({ url })
  };
};

module.exports = { UrlMatcher };
