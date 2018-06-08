const fetchInformation = require('./fetchInformation');

module.exports = (io, socket) => {
  fetchInformation(io, socket);
};