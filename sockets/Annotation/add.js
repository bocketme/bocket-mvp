const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - add', (annotation) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(workspace => {
        workspace.Annotations.push(annotation);
        return workspace.save();
      })
      .then(({ Annotations }) => socket.emit('[Annotation] - getTheLastAnnotation', Annotations[Annotations.length - 1]))
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      })
  });
}
