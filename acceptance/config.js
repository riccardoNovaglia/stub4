const uiPort = process.env.UI_PORT;
const stubsPort = process.env.STUBS_PORT;

module.exports = {
  appUrl: uiPort === '80' ? 'http://localhost' : `http://localhost:${uiPort}`,
  stubsUrl: `http://localhost:${stubsPort}`
};
