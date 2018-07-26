const deleteNode = require('./delete');
const editName = require('./editName')
module.exports = (io, socket) => {
  deleteNode(io, socket);
  editName(io, socket);
};
