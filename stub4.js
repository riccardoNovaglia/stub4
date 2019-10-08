#!/usr/bin/env node

const { app, load } = require('./build/src/app');
const files = require('./server/src/files');

try {
  const loadFile = process.argv[2];
  load(loadFile);
} catch (e) {}

app.listen(8080, () => {
  console.log('Started on 8080');
});

files.listen(80, () => {
  console.log('Started on 80');
});
