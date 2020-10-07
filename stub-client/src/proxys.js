const { byId, setEnabledById } = require('./byId');

async function getById(id) {
  return await byId('proxy', id);
}

async function setEnabled(stub, enabled) {
  return await setEnabledById('proxy', stub.id, enabled);
}

module.exports = {
  getById,
  setEnabled
};
