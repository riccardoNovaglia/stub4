const { takeWhile } = require('lodash');

function UrlMatcher(url) {
  if (!url) throw new Error('A request matcher url must be provided!');

  const trimmedUrl = url.trim();

  if (trimmedUrl.includes('*')) return StarMatcher(trimmedUrl);

  if (trimmedUrl.includes('{') && trimmedUrl.includes('}')) return VariableMatcher(trimmedUrl);

  return SimpleMatcher(trimmedUrl);
}

const SimpleMatcher = (url) => {
  return {
    url: decodeURI(url),
    matches(urlToMatch) {
      return this.url === decodeURI(urlToMatch);
    },
    getMatchedMap() {
      return undefined;
    },
    equals(otherMatcher) {
      return otherMatcher.url === this.url;
    },
    pretty() {
      return this.url;
    },
    toJson() {
      return { url: this.url };
    }
  };
};

const VariableMatcher = (url) => {
  const findVariablesInCurlies = /\{([^}]+)\}/g;
  const capturedGroups = url.match(findVariablesInCurlies);
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
};

function StarMatcher(url) {
  function findStartMatcher(url) {
    const urlToFind = url.replace('*', '');
    if (url.endsWith('*')) return StartMatcher(urlToFind);
    if (url.startsWith('*')) return EndMatcher(urlToFind);
    return MiddleMatcher(url);
  }
  const matcher = findStartMatcher(url);
  return {
    ...BaseStar(url),
    ...matcher
  };
}

function StartMatcher(urlToFind) {
  return {
    urlToFind,
    matches(urlToMatch) {
      return urlToMatch.startsWith(this.urlToFind);
    }
  };
}

function EndMatcher(urlToFind) {
  return {
    urlToFind,
    matches(urlToMatch) {
      return urlToMatch.endsWith(this.urlToFind);
    }
  };
}

function MiddleMatcher(url) {
  const [start, end] = url.split('*');
  return {
    start,
    end,
    matches(urlToMatch) {
      return urlToMatch.startsWith(this.start) && urlToMatch.endsWith(this.end);
    }
  };
}

function BaseStar(url) {
  return {
    url: decodeURI(url),
    getMatchedMap() {
      return undefined;
    },
    equals(otherMatcher) {
      return otherMatcher.url === this.url;
    },
    pretty() {
      return this.url;
    },
    toJson() {
      return { url: this.url };
    }
  };
}

module.exports = { UrlMatcher };
