const { getAxios } = require('./axios');

class ContractsClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async generateContracts() {
    await this.ax.post('/generate-pact', { consumer: 'SomeApp' });
  }
}

module.exports = { ContractsClient };
