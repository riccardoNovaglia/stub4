const { getAxios } = require('./axios');

class ProxyClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async proxyRequests(url, proxyUrl) {
    await this.ax.post(`/proxy/new`, {
      requestMatcher: { url },
      proxy: { destination: { url: proxyUrl } }
    });
  }

  async fetchProxy(set) {
    const res = await this.ax.get(`/proxy`);
    set(res.data);
  }

  async clearProxy() {
    await this.ax.post('/proxy/clear');
  }
}

module.exports = { ProxyClient };
