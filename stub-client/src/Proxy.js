function proxyTo(url) {
  return {
    toJson() {
      return { proxy: { destination: { url } } };
    }
  };
}

module.exports = { proxyTo };
