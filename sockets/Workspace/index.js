const changeRole = require('./changeRole');
const removeUser = require('./removeUser');
const joinRoom = require('./joinRoom');
const invite = require('./invite');
const hasBeenRemoved = require('./hasBeenRemoved');
module.exports = (io, socket) => {
  changeRole(io, socket);
  removeUser(io, socket);
  joinRoom(io, socket);
  invite(io, socket);
  hasBeenRemoved(io, socket);
};
