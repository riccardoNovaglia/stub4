const axios = require('axios');

function getAxios(port) {
  return axios.create({
    baseURL: `http://localhost:${port}`
  });
}

module.exports = { getAxios };
