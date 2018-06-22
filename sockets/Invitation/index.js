// const organization = require('./organization');
const workspace = require('./workspace');

module.exports = (io, socket) => {
  // organization(io, socket);
  workspace(io, socket);
};
