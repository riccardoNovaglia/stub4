const { getAxios } = require('./axios');

class UnmatchedClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async fetchUnmatched(setFn) {
    const res = await this.ax.get('/unmatched');
    setFn(res.data);
  }
}

module.exports = { UnmatchedClient };
