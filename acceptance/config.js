const uiPort = process.env.UI_PORT;
const stubsPort = process.env.STUBS_PORT;

module.exports = {
  appUrl: `http://localhost:${uiPort}`,
  stubsUrl: `http://localhost:${stubsPort}`
};
