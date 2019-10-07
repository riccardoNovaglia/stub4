const axios = require('./axios');

export class ProxyClient {
  async proxyRequests(url, proxyUrl) {
    await axios.post(`/proxy/new`, {
      requestMatcher: { url },
      proxy: { destination: { url: proxyUrl } }
    });
  }

  async fetchProxy(set) {
    const res = await axios.get(`/proxy`);
    set(res.data);
  }

  async clearProxy() {
    await axios.post('/proxy/clear');
  }
}
