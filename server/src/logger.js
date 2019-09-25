function log(msg) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(msg);
  }
}

module.exports = log;
