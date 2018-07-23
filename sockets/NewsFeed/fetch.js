const Workspace = require('../../models/Workspace');
const User = require('../../models/User');

async function getNamesFromIds(newsfeeds) {
  for (const elem of newsfeeds) {
    if (elem.author !== null) {
      const user = await User.findById(elem.author._id);
      elem.author = { _id: user._id, completeName: user.completeName };
    } else {
      elem.author = { _id: '0', completeName: 'Unknown User' };
    }
    if (elem.type === 'USER') {
      const userTarget = await User.findById(elem.content.target._id);
      if (userTarget != null)
        elem.content.target.name = userTarget.completeName;
    }
  }
  return newsfeeds;
}

async function getNameFromId(newsfeed) {
  const res = newsfeed;
  const user = await User.findOne({ email: res.author.email });
  res.author = { _id: user._id, completeName: user.completeName };
  return res;
}

module.exports = (io, socket) => {
  socket.on('[Newsfeed] - fetch', (offset = null, limit = 20) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .populate('Newsfeed.author', '')
      .then(({ Newsfeed }) => {
        if (offset !== null) {
          const res = Newsfeed.slice(offset, offset + limit);
          getNamesFromIds(res).then((newsfeeds) => {
            socket.emit('[Newsfeed] - fetch', newsfeeds, Newsfeed.length);
          });
        } else {
          getNamesFromIds(Newsfeed).then((newsfeeds) => {
            socket.emit('[Newsfeed] - fetch', newsfeeds, Newsfeed.length);
          });
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
        getNameFromId(result).then((res) => {
          socket.emit('[Newsfeed] - fetchByName', res);
        });
      });
  });
};
