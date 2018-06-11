const deleteNode = require('./delete');

module.exports = (io, socket) => {
  deleteNode(io, socket);
}
