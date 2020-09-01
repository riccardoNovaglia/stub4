const _ = require('lodash');
const { v4: uuid } = require('uuid');

const { createLogger } = require('../logger');

const { Response } = require('../response/Response');
const { RequestMatcher } = require('../matching/RequestMatcher');
const Outcome = require('./Outcome');

const logger = createLogger('scenarios');

const Scenario = (requestMatcher, defaultResponse, outcomes) => {
  return {
    id: uuid(),
    requestMatcher,
    defaultResponse,
    outcomes,

    matches(url, method, headers, body) {
      return this.requestMatcher.matches({ url, method, headers, body });
    },
    getResponse(url, body) {
      logger.debug(`Finding matching outcome for ${url} ${body}`);
      const outcome = this.findMatchingOutcome(url, body);

      if (outcome !== undefined) return outcome.response;
      else return this.defaultResponse;
    },
    findMatchingOutcome(url, body) {
      const matchedMapFromUrl = this.requestMatcher.urlMatcher.getMatchedMap(url);
      return matchedMapFromUrl
        ? this.outcomes.find((outcome) => outcome.matchesMaps(matchedMapFromUrl))
        : this.outcomes.find((outcome) => outcome.matchesBody(body));
    },
    toJson() {
      return {
        id: this.id,
        requestMatcher: this.requestMatcher.toJson(),
        outcomes: this.outcomes.map((outcome) => outcome.toJson()),
        defaultResponse: this.defaultResponse
      };
    }
  };
};

function ScenarioFrom(requestMatcher, defaults, outcomes) {
  return Scenario(
    RequestMatcher(requestMatcher),
    Response(defaults.response),
    outcomes.map((outcome) => Outcome(outcome))
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

function ScenarioFromJs(item) {
  const { default: defaults, outcomes } = item.scenarios;
  return ScenarioFrom(item.requestMatcher, defaults, outcomes);
}

module.exports = { Scenario, ScenarioFromRequest, ScenarioFromFile, ScenarioFromJs };
