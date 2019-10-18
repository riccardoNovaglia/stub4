const express = require('express');
const path = require('path');

const ui = express();

const clientFiles = path.resolve(__dirname, '../dist');

ui.use(express.static(clientFiles, { index: false }));

ui.get('*', (_, res) => {
  res.sendFile(path.resolve(clientFiles, 'index.html'));
});

module.exports = ui;
