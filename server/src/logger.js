const winston = require('winston');
const { format } = require('winston');
const { combine, label, colorize, printf } = format;

const config = require('./config');

function log(msg) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(msg);
  }
}

const typeLabelFormat = printf(({ level, message, label }) => {
  const pad = level.length !== 15 ? ' ' : '';
  return `${level}${pad} [${label}]: ${message}`;
});

const toFilter = config.logging.toIgnore;
const filterByConfig = format(info => {
  if (toFilter.includes(info.label)) {
    return false;
  }
  return info;
});

function createLogger(keyword) {
  return winston.createLogger({
    level: config.logging.baseLevel,
    format: combine(label({ label: keyword }), filterByConfig(), colorize(), typeLabelFormat),
    transports: [new winston.transports.Console()]
  });
}

module.exports = { log, createLogger };
