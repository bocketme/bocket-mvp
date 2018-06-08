const changeRole = require('./changeRole');
const removeUser = require('./removeUser');
const joinRoom = require('./joinRoom');

module.exports = (io, socket) => {
  changeRole(io, socket);
  removeUser(io, socket);
  joinRoom(io, socket);
};
