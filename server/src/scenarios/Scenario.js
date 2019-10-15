const _ = require('lodash');

const UrlMatcher = require('./UrlMatcher');
const BodyMatcher = require('./BodyMatcher');
const Outcome = require('./Outcome');

const Scenario = (urlMatcher, bodyMatcher, defaultResponse, outcomes) => ({
  urlMatcher,
  bodyMatcher,
  defaultResponse,
  outcomes,

  matches(url, body) {
    return this.urlMatcher.matches(url) && this.bodyMatcher.matches(body);
  },
  getResponseFor(url, body) {
    const matchedMapFromUrl = this.urlMatcher.getMatchedMap(url);
    if (matchedMapFromUrl) {
      const matchedOutcome = this.outcomes.find(outcome => outcome.matchesMaps(matchedMapFromUrl));

      return matchedOutcome ? matchedOutcome.toResponse() : this.defaultResponse.response;
    } else {
      const matchedOutcome = this.outcomes.find(outcome => outcome.matchesBody(body));

      return matchedOutcome ? matchedOutcome.toResponse() : this.defaultResponse.response;
    }
  }
});

function ScenarioFrom(url, body, defaults, outcomes) {
  const defaultResponse = {
    statusCode: 200,
    body: {},
    ...defaults
  };

  return Scenario(
    UrlMatcher(url),
    BodyMatcher(body),
    defaults,
    outcomes.map(outcome => Outcome(outcome, defaultResponse))
  );
}

function ScenarioFromRequest(req) {
  return ScenarioFrom(
    req.body.matching.url,
    req.body.matching.body,
    req.body.default,
    req.body.outcomes
  );
}

function ScenarioFromFile(fromFile) {
  return ScenarioFrom(
    fromFile.matching.url,
    fromFile.matching.body,
    fromFile.default,
    fromFile.outcomes
  );
}

module.exports = { Scenario, ScenarioFromRequest, ScenarioFromFile };
