const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

module.exports = (io, socket) => {
  socket.on('[Tchat] - fetch', () => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(({ Tchats }) => {
        socket.emit('[Tchat] - fetch', Tchats);
      });
  });
  socket.on('[Tchat] - fetchById', (tchat = null) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(({ Tchats }) => {
        if (tchat) {
          const result = Tchats.find(elem => String(elem._id) === tchat);
          socket.emit('[Tchat] - fetchById', result);
        } else {
          socket.emit('[Tchat] - 404');
        }
      });
  });
  socket.on('[Tchat] - fetchJoinedTchat', () => {
    const { userMail, currentWorkspace } = socket.handshake.session;
    Workspace
      .findById(currentWorkspace)
      .then(({ Tchats }) => {
        User.findOne({ email: userMail }).then((user) => {
          const result = Tchats.filter(tchat => tchat.users.find(lm => String(lm) === String(user._id)) !== undefined);
          socket.emit('[Tchat] - fetch', result);
        });
      });
  });
  socket.on('[Tchat] - joinRoom', (room) => {
    console.log('Je join la room:', room, typeof(room));
    socket.join(room);
  });
};
