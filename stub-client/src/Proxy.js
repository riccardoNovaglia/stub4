function proxyTo(url) {
  return {
    delay: undefined,
    delayedBy(delay) {
      this.delay = delay;
      return this;
    },
    toJson() {
      return { proxy: { destination: { url }, delay: this.delay } };
    }
  };
}

module.exports = { proxyTo };
