const axios = require('./axios');

export class UnmatchedClient {
  async fetchUnmatched(setFn) {
    const res = await axios.get('/unmatched');
    setFn(res.data);
  }
}
