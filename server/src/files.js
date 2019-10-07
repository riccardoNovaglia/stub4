const express = require('express');
const path = require('path');

const files = express();

files.use(express.static('build', { index: false }));

files.get('*', (_, res) => {
  res.sendFile(path.resolve('build', 'index.html'));
});

module.exports = files;
