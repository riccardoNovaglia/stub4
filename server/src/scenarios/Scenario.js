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

function ScenarioFromRequest(req) {
  const urlMatcher = UrlMatcher(req.body.matching.url);

  const defaultResponse = {
    statusCode: 200,
    body: {},
    ...req.body.default.response
  };
  const outcomes = req.body.outcomes.map(outcome => Outcome(outcome, defaultResponse));

  return Scenario(urlMatcher, req.body.default, outcomes);
}

module.exports = { Scenario, ScenarioFromRequest };
