const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - remove', (annotation) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(workspaces => {
        console.log(annotation)
        workspaces.Annotations =
          workspaces
            .Annotations
            .filter(nestedAnnotation => String(nestedAnnotation._id) !== annotation._id);
        return workspaces.save();
      })
      .then(() => {
        socket.emit('Info', 'The Annotation was deleted');
        io
          .in(socket.handshake.session.currentWorkspace)
          .emit('[Annotation] - remove', annotation);
      })
  });
}
