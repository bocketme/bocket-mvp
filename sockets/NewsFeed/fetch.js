const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Newsfeed] - fetch', (offset = null, limit = 20) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .populate('Newsfeed.author', '')
      .then(({ Newsfeed }) => {
        if (offset !== null) {
          console.log('LENGTH:', Newsfeed.length);
          const res = Newsfeed.slice(offset, offset + limit);
          console.log(offset, limit);
          socket.emit('[Newsfeed] - fetch', res, Newsfeed.length);
        } else {
          socket.emit('[Newsfeed] - fetch', Newsfeed, Newsfeed.length);
        }
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
