const { getPort } = require('./stubFor');
const { getAxios } = require('./axios');

async function byId(itemName, id) {
  const stubsPort = getPort();
  let ax = getAxios(stubsPort);
  const response = await ax.get(`/${itemName}/${id}`);

  return response.data;
}

async function setEnabledById(itemName, id, enabled) {
  const stubsPort = getPort();
  let ax = getAxios(stubsPort);
  const response = await ax.post(`/${itemName}/${id}/enabled`, { enabled });

  return response.data;
}

module.exports = {
  byId,
  setEnabledById
};
