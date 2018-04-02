const nodeViewer = require('./nodeViewer');

module.exports = function (io) {
  io.on('connection', (socket) => {
    nodeViewer(io, socket);
  });
};
