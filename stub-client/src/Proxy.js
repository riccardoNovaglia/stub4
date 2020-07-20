function proxyTo(url) {
  return {
    delay: undefined,
    delayedBy(delay) {
      this.delay = delay;
      return this;
    },
    toJson() {
      return { proxy: { destinationUrl: url, delay: this.delay } };
    }
  };
}

module.exports = { proxyTo };
