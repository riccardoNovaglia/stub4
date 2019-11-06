const { getAxios } = require('./axios');

class ScenariosClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async createScenario(scenarioDefinition) {
    return Promise.resolve({});
    // TODO: this
    // await this.ax.post(`/scenarios`, {});
  }

  async fetchScenarios(set) {
    const res = await this.ax.get(`/scenarios`);
    set(res.data);
  }

  async clearScenarios() {
    await this.ax.delete('/scenarios');
  }

  // TODO: this would be useful
  // async fetchInteractions(url, set) {
  //   const res = this.ax.post('/scenarios/count', { url });
  //   set(res.data.count);
  // }
}

module.exports = { ScenariosClient };
