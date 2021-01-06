function respondsWith(statusCode, contentType = 'application/json', body = {}) {
  return {
    toJson() {
      return { response: { statusCode, contentType, body } };
    }
  };
}

module.exports = {
  respondsWith
};
