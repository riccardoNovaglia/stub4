const _ = require('lodash');
const { v4: uuid } = require('uuid');

const { createLogger } = require('../logger');

const { Response } = require('../response/Response');
const { RequestMatcher } = require('../matching/RequestMatcher');
const Outcome = require('./Outcome');

const logger = createLogger('scenarios');

const Scenario = ({ id = uuid(), enabled = true, requestMatcher, defaultResponse, outcomes }) => {
  return {
    id,
    enabled,
    requestMatcher,
    defaultResponse,
    outcomes,

    matches(url, method, headers, body) {
      if (!this.enabled) return false;
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
        enabled: this.enabled,
        requestMatcher: this.requestMatcher.toJson(),
        scenarios: {
          outcomes: this.outcomes.map((outcome) => outcome.toJson()),
          defaultResponse: this.defaultResponse
        }
      };
    },
    setEnabled(enabled) {
      this.enabled = enabled;
      return this.enabled;
    }
  };
};

function ScenarioFrom(id, enabled, requestMatcher, defaults, outcomes) {
  return Scenario({
    id,
    enabled,
    requestMatcher: RequestMatcher(requestMatcher),
    defaultResponse: Response(defaults.response),
    outcomes: outcomes.map((outcome) => Outcome(outcome))
  });
}

function ScenarioFromRequest(req) {
  return ScenarioFrom(
    req.body.id,
    req.body.enabled,
    req.body.requestMatcher,
    req.body.scenarios.default,
    req.body.scenarios.outcomes
  );
}

function ScenarioFromFile(fromFile) {
  return ScenarioFrom(
    fromFile.id,
    fromFile.enabled,
    fromFile.requestMatcher,
    fromFile.default,
    fromFile.outcomes
  );
}

function ScenarioFromJs(item) {
  const { default: defaults, outcomes } = item.scenarios;
  return ScenarioFrom(item.id, item.enabled, item.requestMatcher, defaults, outcomes);
}

module.exports = { Scenario, ScenarioFromRequest, ScenarioFromFile, ScenarioFromJs };
