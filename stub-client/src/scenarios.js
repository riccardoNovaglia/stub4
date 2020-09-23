const { byId } = require('./byId');

async function getById(id) {
  return await byId('scenarios', id);
}

module.exports = {
  getById
};
