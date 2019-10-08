const express = require('express');
const path = require('path');

const files = express();

const clientFiles = path.resolve(__dirname, '../dist');

files.use(express.static(clientFiles, { index: false }));

files.get('*', (_, res) => {
  res.sendFile(path.resolve(clientFiles, 'index.html'));
});

module.exports = files;
