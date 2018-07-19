const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

async function saveandpopulate(workspace, newsfeed, email) {
  const user = await User.findOne({ email });
  if (newsfeed.type === 'USER') {
    const targetUser = await User.findById(newsfeed.content.target._id);
    newsfeed.content.target.name = targetUser.completeName;
  }
  workspace.Newsfeed.unshift({ ...newsfeed, author: user._id });
  await workspace.save();
  return await Workspace.findById(workspace._id).populate('Newsfeed.author', 'completeName');
}

async function saveandpopulateById(workspace, newsfeed, userId) {
  const user = await User.findById(userId);
  if (newsfeed.type === 'USER') {
    const targetUser = await User.findById(newsfeed.content.target._id);
    newsfeed.content.target.name = targetUser.completeName;
  }
  if (user) {
    workspace.Newsfeed.unshift({ ...newsfeed, author: user._id });
  }
  await workspace.save();
  return await Workspace.findById(workspace._id).populate('Newsfeed.author', 'completeName');
}

module.exports = (io, socket) => {
  socket.on('[Newsfeed] - add', (newsfeed) => {
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(workspace => saveandpopulate(workspace, newsfeed, userMail))
      .then(({ Newsfeed }) => {
        const newNewsfeed = Newsfeed[0];
        // AFTER MERGE
        socket.emit('[Newsfeed] - confirmNewsfeed', newNewsfeed);
        socket.to(socket.handshake.session.currentWorkspace).broadcast.emit('[Newsfeed] - fetchNewNewsfeed', newNewsfeed);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      });
  });
  // IS Used when user is added/Deleted to a workspace but doesn't have an account left
  socket.on('[Newsfeed] - addFromWorkspaceAndUser', (newsfeed, workspaceId) => {
    Workspace
      .findById(workspaceId)
      .then(workspace => saveandpopulateById(workspace, newsfeed, newsfeed.author._id))
      .then(({ Newsfeed }) => {
        const newNewsfeed = Newsfeed[0];
        // AFTER MERGE
        socket.emit('[Newsfeed] - confirmNewsfeed', newNewsfeed);
        socket.to(socket.handshake.session.currentWorkspace).broadcast.emit('[Newsfeed] - fetchNewNewsfeed', newNewsfeed);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      });
  });
  // IS Used when user is added/Deleted to a workspace but has still an account
  socket.on('[Newsfeed] - addFromWorkspace', (newsfeed, workspaceId) => {
    const { userMail } = socket.handshake.session;
    Workspace
      .findById(workspaceId)
      .then(workspace => saveandpopulate(workspace, newsfeed, userMail))
      .then(({ Newsfeed }) => {
        const newNewsfeed = Newsfeed[0];
        // AFTER MERGE
        socket.emit('[Newsfeed] - confirmNewsfeed', newNewsfeed);
        socket.to(socket.handshake.session.currentWorkspace).broadcast.emit('[Newsfeed] - fetchNewNewsfeed', newNewsfeed);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The annotation was not created');
      });
  });
};
