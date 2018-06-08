const signIn = require('./signIn');

module.exports = (io, socket) => {
  signIn(io, socket);
};