let unmatched = [];

function addUnmatch(url, method) {
  unmatched.push({ url, method });
}

function all() {
  return unmatched;
}

function clear() {
  unmatched = [];
}

module.exports = {
  addUnmatch,
  all,
  clear
};
