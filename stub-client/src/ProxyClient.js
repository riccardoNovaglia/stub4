const { getAxios } = require('./axios');

class ProxyClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async proxyRequests(url, proxyUrl) {
    await this.ax.post('/proxy', {
      requestMatcher: { url },
      proxy: { destination: { url: proxyUrl } }
    });
  }

  async fetchProxy(set) {
    const res = await this.ax.get('/proxy');
    set(res.data);
  }

  async clearProxy() {
    await this.ax.delete('/proxy');
  }
}

module.exports = { ProxyClient };
