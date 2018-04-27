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
          let filteredUsers = users.filter(elem => elem.email !== userMail );
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
