const express = require('express');
const path = require('path');

const config = require('./config');

const ui = express();

const clientFiles = path.resolve(__dirname, '../dist');

ui.use(express.static(clientFiles, { index: false }));

ui.get('/stubs-port', (_, res) => {
  res.send({ port: config.stubsPort });
});

ui.get('/stub4', (_, res) => {
  res.sendFile(path.resolve(clientFiles, 'index.html'));
});

ui.get('*', (_, res) => res.redirect(301, '/stub4'));

module.exports = ui;
