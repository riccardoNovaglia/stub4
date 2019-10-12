let unmatched = [];

const addUnmatch = (url, method) => {
  if (requestAlreadyExists(url, method)) {
    unmatched.forEach(
      ({ url: prevUnmatechedUrl, method: prevUnmatchedMethod, called: prevCallCount }, index) => {
        if (sameRequest(url, method, prevUnmatechedUrl, prevUnmatchedMethod)) {
          unmatched[index] = { ...unmatched[index], called: prevCallCount + 1 };
        }
      }
    );
  } else {
    unmatched.push({ url, method, called: 1 });
  }
};

const requestAlreadyExists = (url, method) => {
  if (unmatched.length === 0) {
    return false;
  }

  const prevUnmatchedRequest = unmatched.find(({ url: storedUrl, method: storedMethod }) =>
    sameRequest(url, method, storedUrl, storedMethod)
  );
  return prevUnmatchedRequest !== undefined;
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
