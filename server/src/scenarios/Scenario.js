const _ = require('lodash');

const UrlMatcher = require('./UrlMatcher');
const Outcome = require('./Outcome');

const Scenario = (urlMatcher, defaultResponse, outcomes) => ({
  urlMatcher,
  defaultResponse,
  outcomes,

  matches(url) {
    return this.urlMatcher.match(url);
  },
  getResponseFor(url) {
    const matchedMapFromUrl = this.urlMatcher.getMatchedMap(url);

    const matchedOutcome = this.outcomes.find(outcome => outcome.matchesMaps(matchedMapFromUrl));

    return matchedOutcome ? matchedOutcome.toResponse() : this.defaultResponse.response;
  }
});

function ScenarioFrom(url, defaults, outcomes) {
  const defaultResponse = {
    statusCode: 200,
    body: {},
    ...defaults
  };

  return Scenario(
    UrlMatcher(url),
    defaults,
    outcomes.map(outcome => Outcome(outcome, defaultResponse))
  );
}

function ScenarioFromRequest(req) {
  return ScenarioFrom(req.body.matching.url, req.body.default, req.body.outcomes);
}

function ScenarioFromFile(fromFile) {
  return ScenarioFrom(fromFile.matching.url, fromFile.default, fromFile.outcomes);
}

module.exports = { Scenario, ScenarioFromRequest, ScenarioFromFile };
