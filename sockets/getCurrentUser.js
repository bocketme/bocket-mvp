const User = require('../models/User');

module.exports = (io, socket) => {
  socket.on('[User] - getCurrentUser', () => {
    const { userMail } = socket.handshake.session;
    User.findOne({ email: userMail }).then((user) => {
      if (user) {
        const newUser = {
          _id: user._id,
          completeName: user.completeName,
          email: user.email,
          avatar: user.avatar,
        };
        console.log(newUser);
        socket.emit('[User] - getCurrentUser', newUser);
      }
    });
  });
};
