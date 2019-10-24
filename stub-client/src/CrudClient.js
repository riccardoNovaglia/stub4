const { getAxios } = require('./axios');

export class CrudClient {
  constructor(port) {
    this.ax = getAxios(port);
  }

  async createCrud(url, idAlias) {
    await this.ax.post(`/cruds/new`, { url, idAlias });
  }

  async fetchCruds(set) {
    const res = await this.ax.get(`/cruds`);
    set(res.data);
  }

  async clearCruds() {
    await this.ax.post('/cruds/clear');
  }

  async fetchCrudData(url, set) {
    const res = await this.ax.get(url);
    set(res.data);
  }

  async saveCrudData(url, data) {
    await this.ax.post(url, data);
  }
}
