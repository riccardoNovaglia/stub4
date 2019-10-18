const fs = require('fs');

let config = {
  defaultsFiles: [],
  stubsPort: 8080,
  uiPort: 80
};

function readProvidedConfig() {
  if (process.argv[2]) {
    const configFile = process.argv[2];
    const parsed = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }).toString());

    config = {
      ...config,
      ...parsed
    };
  }
}
try {
  readProvidedConfig();
} catch (e) {
  console.log('Tried to read provided config file but an error occurred\n', e);
}

module.exports = config;
