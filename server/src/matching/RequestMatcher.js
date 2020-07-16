const { UrlMatcher } = require('./UrlMatcher');
const { BodyMatcher } = require('./BodyMatcher');
const { MethodMatcher } = require('./MethodMatcher');
const { HeadersMatcher } = require('./HeadersMatcher');
const { createLogger } = require('../logger');

const logger = createLogger('match');

function RequestMatcher(requestMatcher) {
  const urlMatcher = UrlMatcher(requestMatcher.url);
  const bodyMatcher = BodyMatcher(requestMatcher.body);
  const methodMatcher = MethodMatcher(requestMatcher.method);
  const headersMatcher = HeadersMatcher(requestMatcher.headers);

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
        ...this.urlMatcher.toJson(),
        method: this.methodMatcher.toJson(),
        body: this.bodyMatcher.toJson(),
        headers: this.headersMatcher.toJson()
      };
    }
  };
}

module.exports = { RequestMatcher };
