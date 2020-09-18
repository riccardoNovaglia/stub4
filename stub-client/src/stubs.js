const { getPort } = require('./stubFor');
const { getAxios } = require('./axios');

async function getById(id) {
  const stubsPort = getPort();
  let ax = getAxios(stubsPort);
  const response = await ax.get(`/stubs/${id}`);

  return response.data;
}

module.exports = {
  getById
};
