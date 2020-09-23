const { byId } = require('./byId');

async function getById(id) {
  return await byId('cruds', id);
}

module.exports = {
  getById
};
