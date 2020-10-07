const { byId, setEnabledById } = require('./byId');

async function getById(id) {
  return await byId('stubs', id);
}

async function setEnabled(stub, enabled) {
  return await setEnabledById('stubs', stub.id, enabled);
}

module.exports = {
  getById,
  setEnabled
};
