import axios from 'axios';

export async function createDb(url, idAlias) {
  await axios.post('/dbs/new', { url, idAlias });
}
