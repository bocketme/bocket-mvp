const userSchema = require('../../models/User');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on("[User] - change Password", async (password) => {
    try {
      const userId = socket.handshake.session.userId;

      const user = await userSchema.findById(userId);

      user.password = password;

      await user.save();
      return socket.emit("[User] - change Password");
    } catch (e) {
      log.error(e);
    }
    socket.emit("[User] - change Password", 'Cannot change the password ');
  });
}
