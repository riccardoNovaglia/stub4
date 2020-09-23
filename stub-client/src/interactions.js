const { getPort } = require('./stubFor');
const { getAxios } = require('./axios');

async function getInteractions() {
  const stubsPort = getPort();
  let ax = getAxios(stubsPort);
  return await ax.get('/interactions');
}

async function clearInteractions() {
  const stubsPort = getPort();
  let ax = getAxios(stubsPort);
  return await ax.delete('/interactions');
}

module.exports = {
  getInteractions,
  clearInteractions
};
