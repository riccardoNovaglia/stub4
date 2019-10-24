const { getAxios } = require('./axios');

export class StubClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async stub(stubDefinition) {
    await this.ax.post(`/stubs/new`, {
      requestMatcher: { url: stubDefinition.url, method: stubDefinition.method },
      response: {
        type: stubDefinition.type,
        body: stubDefinition.body,
        statusCode: stubDefinition.statusCode
      }
    });
  }

  get(url) {
    return {
      returns: (type, body, status) => ({
        url,
        method: 'GET',
        type,
        body,
        statusCode: status
      })
    };
  }

  post(url) {
    return {
      returns: (type, body, status) => ({
        url,
        method: 'POST',
        type,
        body,
        statusCode: status
      })
    };
  }

  request(method, url) {
    switch (method) {
      case 'GET':
        return this.get(url);
      case 'POST':
        return this.post(url);
      default:
        throw new Error('Not yet');
    }
  }

  async fetchStubs(set) {
    const res = await this.ax.get(`/stubs`);
    set(res.data);
  }

  async clearStubs() {
    await this.ax.post('/stubs/clear');
  }

  async fetchInteractions(url, set) {
    const res = await this.ax.post('/stubs/count', { url });
    set(res.data.count);
  }
}
