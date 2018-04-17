const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - remove', (annotation) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(workspaces => {
        console.log(annotation)
        console.log(workspaces.Annotations.length);
        workspaces.Annotations =
          workspaces
          .Annotations
          .filter(nestedAnnotation => String(nestedAnnotation._id) !== annotation._id);
        console.log(workspaces.Annotations.length);
        return workspaces.save();
      })
      .then(() => {
        socket.emit('Info', 'The Annotation was deleted');
        io
          .to(socket.handshake.session.currentWorkspace)
          .emit('[Annotation] - fetch', nestedAnnotation);
      })
  });
}
