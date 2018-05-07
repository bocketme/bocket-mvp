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
  const tchat = { title: 'General', messages: [], users: newUsers };
  workspace.Tchats.push(tchat);
  await workspace.save();
  const completedWorkspace = await Workspace.findById(workspace._id);
  return completedWorkspace;
}

async function addNewUser(workspace, tchatId, addedUsers) {
  let index = workspace.Tchats.findIndex((tchat) => String(tchat._id) === String(tchatId));
  for (user of addedUsers) {
    workspace.Tchats[index].users.push(user);
  }
  await workspace.save();
  const completedWorkspace = await Workspace.findById(workspace._id);
  return completedWorkspace;
};

module.exports = (io, socket) => {
  socket.on('[Tchat] - add', (tchat) => {
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(workspace => saveandpopulate(workspace, tchat, userMail))
      .then(({ Tchats }) => {
        const newTchat = Tchats[Tchats.length - 1];
        socket.broadcast.to(currentWorkspace).emit('[Tchat] - notifUserAdded', newTchat, newTchat.users);
        socket.emit('[Tchat] - confirmAdd', newTchat);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The Tchat was not created');
      });
  });

  socket.on('[Tchat] - addGeneralTchat', (tchat) => {
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(workspace => addGeneralTchat(workspace, tchat, userMail))
      .then(({ Tchats }) => {
        const newTchat = Tchats[Tchats.length - 1];
        socket.broadcast.to(currentWorkspace).emit('[Tchat] - notifUserAdded', newTchat);
        socket.emit('[Tchat] - confirmAdd', newTchat);
      })
      .catch(err => {
        console.error(err);
        socket.emit('Error', 'The Tchat was not created');
      });
  });

  socket.on('[Tchat] - addUser', (tchatId, users) => {
    const { currentWorkspace } = socket.handshake.session;
    if (tchatId != null && tchatId != undefined && users.length > 0) {
      Workspace
        .findById(currentWorkspace)
        .then(workspace => addNewUser(workspace, tchatId, users))
        .then(({ Tchats }) => {
          const tchat = Tchats.find(elem => String(elem._id) === String(tchatId));
          socket.broadcast.to(currentWorkspace).emit('[Tchat] - notifUserAdded', tchat, users);
          socket.emit('[Tchat] - confirmUserAdd', tchat);
        }).catch(err => {
          console.error(err);
          socket.emit('Error', 'The Selected users were not added');
        });
    }
  });
};
