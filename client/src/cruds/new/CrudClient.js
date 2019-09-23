import axios from 'axios';

export async function createCrud(url, idAlias) {
  await axios.post('/cruds/new', { url, idAlias });
}
