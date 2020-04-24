const _ = require('lodash');

const { createLogger } = require('../logger');

const { RequestMatcher } = require('../matching/RequestMatcher');
const Outcome = require('./Outcome');

const logger = createLogger('scenarios');

const Scenario = (requestMatcher, defaultResponse, outcomes) => ({
  requestMatcher,
  defaultResponse,
  outcomes,

  matches(url, method, headers, body) {
    return this.requestMatcher.matches({ url, method, headers, body });
  },
  getResponseFor(url, body) {
    logger.debug(`Finding matching scenario for ${url} ${body}`);
    const matchedMapFromUrl = this.requestMatcher.urlMatcher.getMatchedMap(url);
    if (matchedMapFromUrl) {
      const matchedOutcome = this.outcomes.find((outcome) =>
        outcome.matchesMaps(matchedMapFromUrl)
      );

      return matchedOutcome ? matchedOutcome.toResponse() : this.defaultResponse.response;
    } else {
      const matchedOutcome = this.outcomes.find((outcome) => outcome.matchesBody(body));

      return matchedOutcome ? matchedOutcome.toResponse() : this.defaultResponse.response;
    }
  },
  toJson() {
    return {
      requestMatcher: this.requestMatcher.toJson(),
      outcomes: this.outcomes.map((outcome) => outcome.toJson()),
      defaultResponse: this.defaultResponse
    };
  }
});

function ScenarioFrom(requestMatcher, defaults, outcomes) {
  const defaultResponse = {
    statusCode: 200,
    body: {},
    ...defaults
  };

  return Scenario(
    RequestMatcher(requestMatcher),
    defaults,
    outcomes.map((outcome) => Outcome(outcome, defaultResponse))
  );
}

function ScenarioFromRequest(req) {
  return ScenarioFrom(
    req.body.requestMatcher,
    req.body.scenarios.default,
    req.body.scenarios.outcomes
  );
}

function ScenarioFromFile(fromFile) {
  return ScenarioFrom(fromFile.requestMatcher, fromFile.default, fromFile.outcomes);
}

module.exports = { Scenario, ScenarioFromRequest, ScenarioFromFile };
