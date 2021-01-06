class RequestMatcher {
  constructor(url) {
    this.url = url;
    this.method = 'GET';
    this.bodyMatcherValue = null;
    this.contenType = 'application/json';
  }

  withMethod(method) {
    this.method = method;
    return this;
  }
  withBody(bodyMatcher) {
    this.bodyMatcherValue = bodyMatcher;
    return this;
  }
  withXmlBodyMatch(xmlMatch) {
    this.contenType = 'application/xml';
    this.bodyMatcherValue = xmlMatch;
    return this;
  }
  withType(type) {
    this.contenType = type;
    return this;
  }

  toJson() {
    // TODO: is there a better way?
    const body = this.bodyMatcherValue
      ? { value: this.bodyMatcherValue, contenType: this.contenType }
      : undefined;

    return {
      url: this.url,
      method: this.method,
      body
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
  // TODO: make this work
  return new RequestMatcher(url).withMethod('*');
}

module.exports = { request, url, GET, POST };
