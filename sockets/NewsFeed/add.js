const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

async function saveandpopulate(workspace, newsfeed, email) {
  const user = await User.findOne({ email });
  workspace.Newsfeed.push({ ...newsfeed, author: user._id });
  console.log({ ...newsfeed, creator: user._id });
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
        const newNewsfeed = Newsfeed[Newsfeed.length - 1];
        console.log('creator : ', newNewsfeed.creator);
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