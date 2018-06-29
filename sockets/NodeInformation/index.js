const fetchInformation = require('./fetchInformation');
const searchNodeChildren = require('./searchNodeChildren');

module.exports = (io, socket) => {
  fetchInformation(io, socket);
  searchNodeChildren(io, socket);
};
