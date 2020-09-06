#!/usr/bin/env node
const app = require('./app');
const ui = require('./ui');
const config = require('./config');
const fileLoader = require('./loading/fileLoader');

fileLoader.loadDefaultsFiles(config.defaultsFiles);

const stubsPort = app.start(config.stubsPort);
console.log(`Stubs started on ${stubsPort}`);

const uiPort = ui.start(config.uiPort, config.stubsPort);
console.log(`UI started on ${uiPort} - http://localhost:${uiPort}`);
