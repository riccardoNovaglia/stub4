const { getPort } = require('./stubFor');
const { getAxios } = require('./axios');

function stubbings(itemName) {
  return {
    async getById(id) {
      const ax = getAxios(getPort());
      const response = await ax.get(`/${itemName}/${id}`);
      return response.data;
    },
    async deleteById(id) {
      const ax = getAxios(getPort());
      const response = await ax.delete(`/${itemName}/${id}`);
      return response.data;
    },
    async setEnabled(id, enabled) {
      const ax = getAxios(getPort());
      const response = await ax.post(`/${itemName}/${id}/enabled`, { enabled });
      return response.data;
    }
  };
}

module.exports = {
  stubbings
};
