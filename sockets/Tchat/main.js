const addMessage = require('./addMessage');
const addTchat = require('./addTchat');
const getTchat = require('./getTchats');
const removeTchat = require('./removeTchat');

module.exports = (io, socket) => {
  addMessage(io, socket);
  addTchat(io, socket);
  getTchat(io, socket);
  removeTchat(io, socket);
};
