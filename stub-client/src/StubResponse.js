function respondsWith(statusCode, type = 'json', body = {}) {
  return {
    toJson() {
      return { response: { statusCode, type, body } };
    }
  };
}

module.exports = {
  respondsWith
};
