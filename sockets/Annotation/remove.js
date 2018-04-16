const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - remove', (annotation) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(workspaces => {
        workspaces.Annotations = 
        workspaces
        .Annotations
        .filter(nestedAnnotation => nestedAnnotation._id !== anntation._id) 
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
