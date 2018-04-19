const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - add', (annotation) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(workspace => {
        workspace.Annotations.push(annotation);
        return workspace.save();
      })
      .then(({ Annotations }) => {
        const newAnnotation = Annotations[Annotations.length - 1]
        socket.emit('[Annotation] - confirmAnnotation', newAnnotation)
        socket.to(socket.handshake.session.currentWorkspace).broadcast.emit('[Annotation] - fetchNewAnnotation', newAnnotation)
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      })
  });
}
