function respondsWith(statusCode, type = 'json', body = {}) {
  return {
    response: {
      statusCode,
      type,
      body
    }
  };
}

module.exports = {
  respondsWith
};
