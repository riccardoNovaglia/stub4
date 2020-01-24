class RequestMatcher {
  constructor(url) {
    this.url = url;
    this.method = 'GET';
    this.bodyMatcher = null;
    this.type = 'json';
  }

  withMethod(method) {
    this.method = method;
    return this;
  }
  withBody(bodyMatcher) {
    this.bodyMatcher = bodyMatcher;
    return this;
  }
  withType(type) {
    this.type = type;
    return this;
  }

  toJson() {
    // TODO: is there a better way?
    const body = this.bodyMatcher
      ? { bodyMatch: this.bodyMatcher, type: this.bodyMatchType }
      : undefined;

    return {
      url: this.url,
      method: this.method,
      body,
      type: this.type
    };
  }
}

function request(url) {
  // TODO: reject blank url
  return new RequestMatcher(url);
}
function GET(url) {
  return new RequestMatcher(url).withMethod('GET');
}
function POST(url) {
  return new RequestMatcher(url).withMethod('POST');
}
function url(url) {
  return new RequestMatcher(url).withMethod('*');
}

module.exports = { request, url, GET, POST };
