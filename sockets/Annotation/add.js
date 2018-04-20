const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Annotation] - add', (annotation) => {
    const { currentWorkspace, userMail } = socket.handshake.session;
    Workspace
      .findById()
      .then(workspace => {
        workspace.Annotations.push({...annotation, creator: userMail });
        return workspace.save(currentWorkspace);
      })
      .then(({ Annotations }) => {
        const newAnnotation = Annotations[Annotations.length - 1];
        socket.emit('[Annotation] - confirmAnnotation', newAnnotation);
        socket.to(socket.handshake.session.currentWorkspace).broadcast.emit('[Annotation] - fetchNewAnnotation', newAnnotation);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      });
  });
}