const UrlMatcher = url => {
  const findVariablesInCurlies = /\{([^}]+)\}/g;
  const capturedGroups = Array.from(url.matchAll(findVariablesInCurlies));
  const variableNames = capturedGroups.map(group => group[1]);

  var regexedUrl = url;
  variableNames.forEach(subVal => (regexedUrl = regexedUrl.replace(`{${subVal}}`, '(.*)')));
  const escapedRegexedUrl = regexedUrl.replace('?', '\\?');
  const regex = new RegExp(escapedRegexedUrl, 'g');

  function getMatchedGroups(regex, string) {
    const capturedGroups = Array.from(string.matchAll(regex));

    const capturedValues = capturedGroups.map(group => group.slice(1)).flat();

    return capturedValues;
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
