const axios = require('./axios');

export class ContractsClient {
  async generateContracts() {
    await axios.post('/generate-pact', { consumer: 'SomeApp' });
  }
}
