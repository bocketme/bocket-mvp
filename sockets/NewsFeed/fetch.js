const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Newsfeed] - fetch', (newsfeed) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .populate('Newsfeed.author', '')
      .then(({ Newsfeed }) => {
        socket.emit('[Newsfeed] - fetch', Newsfeed, !newsfeed);
      });
  });
  socket.on('[Newsfeed] - fetchByName', (newsfeed = null) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(({ Newsfeed }) => {
        let result = Newsfeed;
        if (newsfeed) {
          result = Newsfeed
            .filter(nestedNewsfeed => nestedNewsfeed.name === newsfeed.name);
        }
        socket.emit('[Newsfeed] - fetchByName', result);
      });
  });
};
