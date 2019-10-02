const axios = require('axios');
const proxy = require('../proxying');

async function middleware(req, res, next) {
  try {
    const url = req.originalUrl;

    const proxyUrl = proxy.get(url);

    const response = await axios.get(proxyUrl);
    return res.status(response.status).send(response.data);
  } catch (e) {
    return next();
  }
}

module.exports = middleware;
