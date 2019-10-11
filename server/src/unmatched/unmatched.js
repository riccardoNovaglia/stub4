let unmatched = [];

const addUnmatch = (url, method) => {
  if (requestAlreadyExists(url, method)) {
    unmatched.forEach((request, index) => {
      if (sameRequest(url, method, request.url, request.method)) {
        const requestClone = { ...unmatched[index] };
        requestClone.called = request.called + 1;
        unmatched[index] = requestClone;
      }
    });
  } else {
    unmatched.push({ url, method, called: 1 });
  }
};

const requestAlreadyExists = (url, method) => {
  if (unmatched.length === 0) {
    return false;
  }

  for (unmatchedRequest of unmatched) {
    if (sameRequest(url, method, unmatchedRequest.url, unmatchedRequest.method)) {
      return true;
    }
  }
  return false;
};

const sameRequest = (url, method, storedUrl, storedMethod) =>
  url === storedUrl && method === storedMethod;

const all = () => unmatched;

const clear = () => (unmatched = []);

module.exports = {
  addUnmatch,
  all,
  clear
};
