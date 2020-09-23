const { byId } = require('./byId');

async function getById(id) {
  return await byId('proxy', id);
}

module.exports = {
  getById
};
