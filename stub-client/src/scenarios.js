const { byId, setEnabledById } = require('./byId');

async function getById(id) {
  return await byId('scenarios', id);
}

async function setEnabled(stub, enabled) {
  return await setEnabledById('scenarios', stub.id, enabled);
}

module.exports = {
  getById,
  setEnabled
};
