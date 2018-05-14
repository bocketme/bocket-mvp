const Workspace = require('../models/Workspace');
const User = require('../models/User');

module.exports = (io, socket) => {
  socket.on('[Users] - fetchFromWorkspace', async (withCurrentUser = false) => {
    try {
      const { userMail } = socket.handshake.session;
      const { users } = await Workspace
        .findById(socket.handshake.session.currentWorkspace)
        .populate('ProductManagers')
        .populate('Teammates')
        .populate('Observers')
        .exec();

      if (withCurrentUser === false) {
        let tmpId = 0;
        users.sort();
        const filteredUsers = users.filter((elem) => {
          const isTrue = (elem.email !== userMail && elem.id !== tmpId);
          if (isTrue) { tmpId = elem._id; }
          return isTrue;
        });
        socket.emit('[Users] - fetchFromWorkspace', filteredUsers);
      } else {
        socket.emit('[Users] - fetchFromWorkspace', users);
      }

    } catch (err) {
      console.error(err);
    }
  });

  socket.on('[Users] - fetchById', async (id) => {
    try {
      const { users } = Workspace
        .findById(socket.handshake.session.currentWorkspace)
        .populate('ProductManagers')
        .populate('Teammates')
        .populate('Observers')
        .exec();

      const fetchedUser = users.find(elem => elem._id === id);
      socket.emit('[Users] - fetchById', fetchedUser);
    } catch (err) {
      console.error(err);
    }
  });
};
