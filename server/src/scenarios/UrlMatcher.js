const UrlMatcher = url => {
  const findVariablesInCurlies = /\{([^}]+)\}/g;
  const capturedGroups = url.match(findVariablesInCurlies);
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
    regex,
    variableNames,
    match(url) {
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

module.exports = UrlMatcher;
