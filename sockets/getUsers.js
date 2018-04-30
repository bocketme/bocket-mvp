const Workspace = require('../models/Workspace');
const User = require('../models/User');

module.exports = (io, socket) => {
  socket.on('[Users] - fetchFromWorkspace', (withCurrentUser = false) => {
    const { userMail } = socket.handshake.session;
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(({ users }) => {
        console.log(users);
        if (withCurrentUser === false) {
          let tmpId = 0;
          users.sort();
          const filteredUsers = users.filter((elem) => {
            const isTrue = (elem.email !== userMail && elem.id !== tmpId);
            if (isTrue) { tmpId = elem._id }
            return isTrue;
          });
          socket.emit('[Users] - fetchFromWorkspace', filteredUsers);
        } else {
          socket.emit('[Users] - fetchFromWorkspace', users);
        }
      });
  });
  socket.on('[Users] - fetchById', (id) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(({ users }) => {
        const fetchedUser = users.find(elem => elem._id === id);
        socket.emit('[Users] - fetchById', fetchedUser);
      });
  });
};
