const signIn = require('./signIn');
const getUsersList = require('./getUserList');
const join = require('./join');
const reload = require('./reload');
const chenagePassword = require('./changePassword');
const hasbeenremoved = require('./hasbeenRemoved');

module.exports = (io, socket) => {
  chenagePassword(io, socket);
  signIn(io, socket);
  getUsersList(io, socket);
  join(io, socket);
  reload(io, socket);
  hasbeenremoved(io, socket);
};
