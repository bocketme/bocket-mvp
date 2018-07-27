const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

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
          const start = async (res) => {
            await asyncForEach(res.messages, async (msg) => {
              const user = await User.findById(msg.author._id);
              if (user)
                msg.author.completeName = user.completeName;
            });
            socket.emit('[Tchat] - fetchById', res);
          };
          start(result);
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
    socket.join(room);
  });
};
