#!/usr/bin/env node
const app = require('./app');
const ui = require('./ui');
const config = require('./config');
const defaultsLoader = require('./defaultsLoader');

defaultsLoader.loadDefaultsFiles(config.defaultsFiles);

app.listen(config.stubsPort, () => {
  console.log(`Stubs started on ${config.stubsPort}`);
});

ui.listen(config.uiPort, () => {
  console.log(`UI started on ${config.uiPort} - http://localhost:${config.uiPort}`);
});
