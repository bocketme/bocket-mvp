const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - fetch', () => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(({ Annotations }) => {
        socket.emit('[Annotation] - fetch', Annotations)
      })
  });
}
