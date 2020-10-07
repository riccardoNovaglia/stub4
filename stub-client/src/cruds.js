const { byId, setEnabledById } = require('./byId');

async function getById(id) {
  return await byId('cruds', id);
}

async function setEnabled(stub, enabled) {
  return await setEnabledById('cruds', stub.id, enabled);
}

module.exports = {
  getById,
  setEnabled
};
