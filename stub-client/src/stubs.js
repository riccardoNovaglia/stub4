const { byId } = require('./byId');

async function getById(id) {
  return await byId('stubs', id);
}

module.exports = {
  getById
};
