const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - add', (annotation) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(workspace => {
        workspace.Annotations.push(annotation);
        return workspace.save();
      })
      .then(socket.emit('Info', 'Annotation Created'))
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      })
  });
}
