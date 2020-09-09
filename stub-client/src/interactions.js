const { getPort } = require('./stubFor');
const { getAxios } = require('./axios');

async function getInteractions() {
  const stubsPort = getPort();
  let ax = getAxios(stubsPort);
  return await ax.get('/interactions');
}

module.exports = {
  getInteractions
};
