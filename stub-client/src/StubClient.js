const axios = require('./axios');

export class StubClient {
  async stub(stubDefinition) {
    await axios.post(`/stubs/new`, {
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
    const res = await axios.get(`/stubs`);
    set(res.data);
  }

  async clearStubs() {
    await axios.post('/stubs/clear');
  }

  async fetchInteractions(url, set) {
    const res = await axios.post('/stubs/count', { url });
    set(res.data.count);
  }
}
