const { getAxios } = require('./axios');

export class ContractsClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async generateContracts() {
    await this.ax.post('/generate-pact', { consumer: 'SomeApp' });
  }
}
