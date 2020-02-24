function UrlMatcher(url) {
  if (!url) return NoopMatcher;

  const findVariablesInCurlies = /\{([^}]+)\}/g;
  const capturedGroups = url.match(findVariablesInCurlies);
  if (!capturedGroups) return SimpleMatcher(url.trim());

  const variableNames = capturedGroups.map(group => group.replace('{', '').replace('}', ''));

  var regexedUrl = url;
  variableNames.forEach(subVal => (regexedUrl = regexedUrl.replace(`{${subVal}}`, '(.*)')));
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
    equals: otherMatcher => otherMatcher.url === url,
    pretty() {
      return regex.toString();
    },
    toJson() {
      return this.url;
    }
  };
}

const NoopMatcher = {
  url: '',
  matches: () => true,
  getMatchedMap: () => undefined,
  equals: otherMatcher => typeof otherMatcher === 'NoopMatcher',
  pretty: () => '*',
  toJson: () => undefined
};

const SimpleMatcher = url => {
  return {
    url,
    matches: urlToMatch => urlToMatch === url,
    getMatchedMap: () => undefined,
    equals: otherMatcher => otherMatcher.url === url,
    pretty: () => url,
    toJson: () => ({ url })
  };
};

module.exports = { UrlMatcher };
