const _ = require('lodash');

const { createLogger } = require('../logger');

const UrlMatcher = require('../matching/UrlMatcher');
const BodyMatcher = require('../matching/BodyMatcher');
const Outcome = require('./Outcome');

const logger = createLogger('scenarios');

const Scenario = (urlMatcher, bodyMatcher, defaultResponse, outcomes) => ({
  urlMatcher,
  bodyMatcher,
  defaultResponse,
  outcomes,

  matches(url, body) {
    return this.urlMatcher.matches(url) && this.bodyMatcher.matches(body);
  },
  getResponseFor(url, body) {
    logger.debug(`Finding matching scenario for ${url} ${body}`);
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
    req.body.requestMatcher.url,
    req.body.requestMatcher.body,
    req.body.default,
    req.body.outcomes
  );
}

function ScenarioFromFile(fromFile) {
  return ScenarioFrom(
    fromFile.requestMatcher.url,
    fromFile.requestMatcher.bodyMatch,
    fromFile.default,
    fromFile.outcomes
  );
}

module.exports = { Scenario, ScenarioFromRequest, ScenarioFromFile };
