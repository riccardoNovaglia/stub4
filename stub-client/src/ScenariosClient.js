const axios = require('./axios');

export class ScenariosClient {
  async createScenario(scenarioDefinition) {
    return Promise.resolve({});
    // TODO: this
    // await axios.post(`/scenarios/new`, {});
  }

  async fetchScenarios(set) {
    const res = await axios.get(`/scenarios`);
    set(res.data);
  }

  async clearScenarios() {
    await axios.post('/scenarios/clear');
  }

  // TODO: this would be useful
  // async fetchInteractions(url, set) {
  //   const res = await axios.post('/scenarios/count', { url });
  //   set(res.data.count);
  // }
}
