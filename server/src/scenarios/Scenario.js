const _ = require('lodash');

const Scenario = (matching, defaultResponse, outcomes) => ({
  matching,
  defaultResponse,
  outcomes,

  urlMatch(url) {
    const match = url.match(matching.regex);
    return match ? match[1] : undefined;
  },
  matches(url) {
    return !!this.urlMatch(url);
  },
  getResponseFor(url) {
    const matchedOutcome = this.outcomes.find(outcome => {
      return outcome.matches(this.matching.variableName.toString(), this.urlMatch(url));
    });

    return matchedOutcome ? matchedOutcome.response() : this.defaultResponse.response;
  }
});

const Outcome = (outcome, defaultResponse) => ({
  outcome,

  matches(variableName, variableValue) {
    return outcome[variableName].toString() === variableValue;
  },
  body() {
    return _.get(this, 'outcome.response.body', defaultResponse.body);
  },
  statusCode() {
    return _.get(this, 'outcome.response.statusCode', defaultResponse.statusCode);
  },
  response() {
    return {
      body: this.body(),
      statusCode: this.statusCode()
    };
  }
});

function ScenarioFromRequest(req) {
  const url = req.body.matching.url;
  const variableStart = url.indexOf('{');
  const variableEnd = url.indexOf('}');
  const variableName = url.slice(variableStart + 1, variableEnd);
  const urlWithCaptureGroup = url.replace(`{${variableName}}`, '(.*)');
  const urlWithEscapedQueries = urlWithCaptureGroup.replace('?', '\\?');
  const regex = new RegExp(urlWithEscapedQueries, 'i');

  const matching = { regex, variableName };

  const defaultResponse = {
    statusCode: 200,
    body: {},
    ...req.body.default.response
  };
  const outcomes = req.body.outcomes.map(outcome => Outcome(outcome, defaultResponse));

  return Scenario(matching, req.body.default, outcomes);
}

module.exports = { Scenario, ScenarioFromRequest };
