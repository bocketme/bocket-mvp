const listenerName = 'changePassword';
const User = require('../models/User');

async function changePasswordListener(userMail, { lastPassword, newPassword, confirmPassword }) {
  const user = await User.findOne({ email: userMail });

  if (!user) return { error: 'Unknown user' };

  if (newPassword.length < 6 || confirmPassword < 6 || newPassword !== confirmPassword) {
    return { error: 'Invalid new password, please check the new and the confirm password' };
  } else if (await user.comparePassword.promise(lastPassword, user.password) === false) {
    return { error: 'Invalid last password.' };
  }
  user.password = newPassword;
  await user.save();
  return { };
}

module.exports = (socket) => {
  socket.on(listenerName, (data) => {
    changePasswordListener(socket.handshake.session.userMail, data)
      .then(result => socket.emit(listenerName, result))
      .catch((err) => {
        socket.emit(listenerName, { error: 'Internal Server Error, please try again' });
        console.log('changePassword error:', err);
      });
  });
};
