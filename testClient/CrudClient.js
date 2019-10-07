const axios = require('./axios');

export class CrudClient {
  async createCrud(url, idAlias) {
    await axios.post(`/cruds/new`, { url, idAlias });
  }

  async fetchCruds(set) {
    const res = await axios.get(`/cruds`);
    set(res.data);
  }

  async clearCruds() {
    await axios.post('/cruds/clear');
  }

  async fetchCrudData(url, set) {
    const res = await axios.get(url);
    set(res.data);
  }

  async saveCrudData(url, data) {
    await axios.post(url, data);
  }
}
