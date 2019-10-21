const UrlMatcher = url => {
  if (!url) return NoopMatcher;

  const findVariablesInCurlies = /\{([^}]+)\}/g;
  const capturedGroups = url.match(findVariablesInCurlies);
  if (!capturedGroups) return SimpleMatcher(url);

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
    }
  };
};

const NoopMatcher = {
  matches: () => true,
  getMatchedMap: () => undefined
};

const SimpleMatcher = url => {
  return {
    matches: urlToMatch => urlToMatch === url,
    getMatchedMap: () => undefined
  };
};

module.exports = UrlMatcher;
