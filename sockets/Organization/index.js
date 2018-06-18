const create = require('./create');
const removeUser = require('./removeUser');
const changeRole = require('./changeRole');
const joinRoom = require('./joinRoom');

module.exports = (io, socket) => {
  create(io, socket);
  removeUser(io, socket);
  changeRole(io, socket);
  joinRoom(io, socket);
}
