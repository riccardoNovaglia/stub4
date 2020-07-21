const express = require('express');
const path = require('path');

const config = require('./config');

const ui = express();

const clientFiles = path.resolve(__dirname, '../dist');

ui.get('/stubs-port', (_, res) => {
  res.send({ port: config.stubsPort });
});

ui.use(express.static(clientFiles));
ui.use(express.static(`${clientFiles}/stub4`));

ui.get('*', (_, res) => res.redirect(301, '/stub4'));

module.exports = ui;
