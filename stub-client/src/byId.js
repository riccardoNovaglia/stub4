const { getPort } = require('./stubFor');
const { getAxios } = require('./axios');

async function byId(itemName, id) {
  const stubsPort = getPort();
  let ax = getAxios(stubsPort);
  const response = await ax.get(`/${itemName}/${id}`);

  return response.data;
}

module.exports = {
  byId
};
