const signIn = require('./signIn');
const getUsersList = require('./getUserList');
const join = require('./join');
const reload = require('./reload');

module.exports = (io, socket) => {
  signIn(io, socket);
  getUsersList(io, socket);
  join(io, socket);
  reload(io, socket);
};
