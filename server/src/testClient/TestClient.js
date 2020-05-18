const axios = require('axios');
function TestClient() {
  const port = 8080;
  return {
    port,
    async get(url, headers = {}) {
      return timed(async () => {
        const response = await manageErrors(() =>
          axios.get(`http://localhost:${this.port}${url}`, { headers })
        );
        return { ...response, body: response.data };
      });
    },
    async post(url, body = {}, headers = {}) {
      return timed(async () => {
        const response = await manageErrors(() =>
          axios.post(`http://localhost:${this.port}${url}`, body, { headers })
        );
        return { ...response, body: response.data };
      });
    },
    async delete(url) {
      return timed(async () => {
        const response = await manageErrors(() =>
          axios.delete(`http://localhost:${this.port}${url}`)
        );
        return { ...response, body: response.data };
      });
    },
    async patch(url, body) {
      return timed(async () => {
        const response = await manageErrors(() =>
          axios.patch(`http://localhost:${this.port}${url}`, body)
        );
        return { ...response, body: response.data };
      });
    },
    setPort(port) {
      this.port = port;
    }
  };
}

async function manageErrors(fn) {
  try {
    return await fn();
  } catch (error) {
    if (error.response !== undefined) {
      return { ...error.response };
    } else {
      throw error;
    }
  }
}

async function timed(fn) {
  const before = new Date();
  const response = await fn();
  const after = new Date();
  const diff = after.getTime() - before.getTime();

  return { ...response, timeTaken: diff };
}

function setup(stub4, setPort, testClient, log = false) {
  const { listeningPort } = stub4.startup(log ? { logLevel: 'debug' } : {});
  setPort(listeningPort);
  testClient.setPort(listeningPort);
}

module.exports = {
  TestClient,
  setup
};
