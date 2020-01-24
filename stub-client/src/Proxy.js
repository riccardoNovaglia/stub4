function proxyTo(url) {
  return { proxy: { destination: { url } } };
}

module.exports = { proxyTo };
