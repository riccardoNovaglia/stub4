const { getAxios } = require('./axios');

class StubClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async stub(stubDefinition) {
    const requestMatcher = stubDefinition.requestMatcher();
    const response = stubDefinition.response();
    await this.ax.post(`/stubs`, {
      requestMatcher,
      response
    });
  }

  request(method, url) {
    switch (method) {
      case 'GET':
        return get(url);
      case 'POST':
        return post(url);
      default:
        throw new Error('Not yet');
    }
  }

  async fetchStubs(set) {
    const res = await this.ax.get(`/stubs`);
    set(res.data);
  }

  async clearStubs() {
    await this.ax.delete('/stubs');
  }

  async fetchInteractions(url, set) {
    const res = await this.ax.get('/stubs/count', { url });
    set(res.data.count);
  }
}

class Stub {
  constructor(url, method = 'GET') {
    this.url = url;
    this.method = method;
    this.bodyMatchType = undefined;
    this.bodyMatch = undefined;
    this.contentType = 'application/json';
    this.body = {};
    this.statusCode = 200;
  }

  withBody(body) {
    this.bodyMatch = body;
    return this;
  }

  withXmlBodyMatch(xmlMatch) {
    this.bodyMatchType = 'application/xml';
    this.bodyMatch = xmlMatch;
    return this;
  }

  returns(contentType, body, statusCode = 200) {
    this.contentType = contentType;
    this.body = body;
    this.statusCode = statusCode;
    return this;
  }

  returnsJson(body, statusCode = 200) {
    this.body = body;
    this.statusCode = statusCode;
    return this;
  }

  requestMatcher() {
    return this.bodyMatch
      ? {
          url: this.url,
          method: this.method,
          body: { bodyMatch: this.bodyMatch, type: this.bodyMatchType }
        }
      : {
          url: this.url,
          method: this.method
        };
  }

  response() {
    return {
      contentType: this.contentType,
      body: this.body,
      statusCode: this.statusCode
    };
  }
}

function get(url) {
  return new Stub(url, 'GET');
}

function post(url) {
  return new Stub(url, 'POST');
}

module.exports = { StubClient, Stub, get, post };
