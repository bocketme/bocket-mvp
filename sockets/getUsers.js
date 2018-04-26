const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

module.exports = (io, socket) => {
  socket.on('[Users] - fetch', () => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(({ Users }) => {
        console.log(Users);
        socket.emit('[Users] - fetch', Users);
      });
  });
};
