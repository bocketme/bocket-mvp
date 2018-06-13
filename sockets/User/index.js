const signIn = require('./signIn');
const getUsersList = require('./getUserList')
module.exports = (io, socket) => {
  signIn(io, socket);
  getUsersList(io, socket);
};
