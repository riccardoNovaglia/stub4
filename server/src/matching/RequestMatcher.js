const { UrlMatcher } = require('./UrlMatcher');
const { BodyMatcher } = require('./BodyMatcher');
const { MethodMatcher } = require('./MethodMatcher');
const { HeadersMatcher } = require('./HeadersMatcher');
const { createLogger } = require('../logger');

const logger = createLogger('match');

function RequestMatcher(matchDefinition) {
  const urlMatcher = UrlMatcher(matchDefinition.url);
  const bodyMatcher = BodyMatcher(matchDefinition.body);
  const methodMatcher = MethodMatcher(matchDefinition.method);
  const headersMatcher = HeadersMatcher(matchDefinition.headers);

  return {
    urlMatcher,
    bodyMatcher,
    methodMatcher,
    headersMatcher,
    matches({ url, method, headers = {}, body }) {
      logger.debug(`Checking if ${this.pretty()} matches ${method} ${url} ${body}`);
      return (
        this.methodMatcher.matches(method) &&
        this.urlMatcher.matches(url) &&
        this.headersMatcher.matches(headers) &&
        this.bodyMatcher.matches(body)
      );
    },
    pretty() {
      return `Request matcher:
      \nURL: ${this.urlMatcher.pretty()}
      \nMETHOD: ${this.methodMatcher.pretty()}
      \nHEADERS: ${this.headersMatcher.pretty()}
      \nBODY: ${this.bodyMatcher.pretty()}
      `;
    },
    equals(otherMatcher) {
      return (
        this.urlMatcher.equals(otherMatcher.urlMatcher) &&
        this.methodMatcher.equals(otherMatcher.methodMatcher)
        // TODO: compare body matcher? Or is url + method enough?
      );
    },
    toJson() {
      return {
        urlMatcher: this.urlMatcher.toJson(),
        method: this.methodMatcher.toJson(),
        bodyMatcher: this.bodyMatcher.toJson(),
        headersMatcher: this.headersMatcher.toJson()
      };
    }
  };
}

module.exports = { RequestMatcher };
