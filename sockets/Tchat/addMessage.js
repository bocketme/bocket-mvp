const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

async function saveandpopulate(workspace, message, email, tchatId) {
  const user = await User.findOne({ email });
  let author = { _id: user._id, completeName: user.completeName };
  let tchatIndex =  workspace.Tchats.findIndex(elem => String(elem._id) === tchatId);
  workspace.Tchats[tchatIndex].messages.push({ content: message, author: author, date: new Date() });
  await workspace.save();
  return await Workspace.findById(workspace._id).populate('Message.author', 'completeName');
}

module.exports = (io, socket) => {
  socket.on('[Message] - add', (message, tchatId) => {
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(workspace => saveandpopulate(workspace, message, userMail, tchatId))
      .then(({ Tchats }) => {
        const newTchat = Tchats.find(elem => String(elem._id) === tchatId);
        const roomId = String(newTchat.id);
        socket.broadcast.to(roomId).emit('[Message] - confirmMessage', tchatId, newTchat.messages[newTchat.messages.length - 1]);
        socket.emit('[Message] - confirmMessage', tchatId, newTchat.messages[newTchat.messages.length - 1]);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The Message was not send');
      });
  });
};
