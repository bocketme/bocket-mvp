const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

async function saveandpopulate(workspace, tchat, email) {
  const user = await User.findOne({ email });
  tchat.users.push(user._id);
  workspace.Tchats.push(tchat);
  await workspace.save();
  const completedWorkspace = await Workspace.findById(workspace._id);
  return completedWorkspace;
}

async function addGeneralTchat(workspace) {
  let users = workspace.users;
  users.push(workspace.owner);
  let newUsers = [];
  users.forEach((user) => {
    newUsers.push(user._id);
  });
  const tchat = { title: 'General - Rodrigo', messages: [], users: newUsers };
  workspace.Tchats.push(tchat);
  await workspace.save();
  const completedWorkspace = await Workspace.findById(workspace._id);
  return completedWorkspace;
}

module.exports = (io, socket) => {
  socket.on('[Tchat] - add', (tchat) => {
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(workspace => saveandpopulate(workspace, tchat, userMail))
      .then(({ Tchats }) => {
        const newTchat = Tchats[Tchats.length - 1];
        socket.emit('[Tchat] - confirmAdd', newTchat);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The Tchat was not created');
      });
  });

  socket.on('[Tchat] - addGeneralTchat', (tchat) => {
    console.log('Im adding a Tchat');
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(workspace => addGeneralTchat(workspace, tchat, userMail))
      .then(({ Tchats }) => {
        const newTchat = Tchats[Tchats.length - 1];
        socket.broadcast.to(currentWorkspace).emit('[Tchat] - confirmAdd', newTchat);
        socket.emit('[Tchat] - confirmAdd', newTchat);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The Tchat was not created');
      });
  });
};
