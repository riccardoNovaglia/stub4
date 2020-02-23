const UrlMatcher = require('./UrlMatcher');
const BodyMatcher = require('./BodyMatcher');
const MethodMatcher = require('./MethodMatcher');
const { createLogger } = require('../logger');

const logger = createLogger('match');

const RequestMatcher = matchDefinition => {
  const urlMatcher = UrlMatcher(matchDefinition.url);
  const bodyMatcher = BodyMatcher(matchDefinition.body);
  const methodMatcher = MethodMatcher(matchDefinition.method);

  return {
    urlMatcher,
    bodyMatcher,
    methodMatcher,
    matches({ url, method, body }) {
      logger.debug(`Checking if ${this.pretty()} matches ${method} ${url} ${body}`);
      return methodMatcher.matches(method) && urlMatcher.matches(url) && bodyMatcher.matches(body);
    },
    pretty() {
      return `Request matcher:
      \nURL: ${this.urlMatcher.pretty()}
      \nMETHOD: ${this.methodMatcher.pretty()}
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
        bodyMatcher: this.bodyMatcher.toJson()
      };
    }
  };
};

module.exports = RequestMatcher;
