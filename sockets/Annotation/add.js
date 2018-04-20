const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

async function saveandpopulate(workspace, annotation, email) {
  const user = await User.findOne({ email });
  workspace.Annotations.push({ ...annotation, creator: user._id });
  await workspace.save();
  const completedWorkspace = await Workspace.findById(workspace._id).populate('Annotations.creator', 'completeName');
  return completedWorkspace;
}

module.exports = (io, socket) => {
  socket.on('[Annotation] - add', (annotation) => {
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(workspace => saveandpopulate(workspace, annotation, userMail))
      .then(({ Annotations }) => {
        const newAnnotation = Annotations[Annotations.length - 1];
        console.log('creator : ', newAnnotation.creator);
        socket.emit('[Annotation] - confirmAnnotation', newAnnotation);
        socket.to(socket.handshake.session.currentWorkspace).broadcast.emit('[Annotation] - fetchNewAnnotation', newAnnotation);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      });
  });
};
