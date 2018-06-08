const Workspace = require('../models/Workspace');
const User = require('../models/User');

module.exports = (io, socket) => {
  socket.on('[Users] - fetchFromWorkspace', async (withCurrentUser = false) => {
    try {
      const { userMail } = socket.handshake.session;
      const workspace = await Workspace
        .findById(socket.handshake.session.currentWorkspace)
        .populate({path: 'ProductManagers', select: 'completeName email'})
        .populate({path: 'Teammates', select: 'completeName email'})
        .populate({path: 'Observers', select: 'completeName email'})
        .exec();

      if (!workspace)
        throw new Error('[Users] - Fetch From Workspace');

      const users = workspace.users;
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
      const user = User.findById(id).select('completeName');
      socket.emit('[Users] - fetchById', user);
    } catch (err) {
      console.error(err);
    }
  });
};
