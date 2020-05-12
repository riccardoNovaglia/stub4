const fs = require('fs');
const path = require('path');

let config = {
  defaultsFiles: [],
  stubsPort: 8080,
  uiPort: 80,
  pact: {
    serverPort: 9093,
    logsDestination: path.resolve(process.cwd(), 'logs', 'pact.log'),
    logLevel: 'WARN',
    contractsFilesDestination: path.resolve(process.cwd(), 'generatedTestPacts')
  },
  logging: {
    baseLevel: process.env.NODE_ENV === 'test' ? 'off' : 'info',
    toIgnore: [],
    specifics: []
  }
};

function readProvidedConfig() {
  if (process.env.NODE_ENV !== 'test' && process.argv[2]) {
    const configFile = process.argv[2];
    const parsed = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }).toString());
    const mergedLogging = {
      ...config.logging,
      ...parsed.logging
    };

    config = {
      ...config,
      ...parsed,
      logging: mergedLogging
    };
  }
}
try {
  readProvidedConfig();
} catch (e) {
  console.log('Tried to read provided config file but an error occurred\n', e);
}

module.exports = config;
