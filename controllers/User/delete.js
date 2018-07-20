const userSchema = require('../../models/User');

async function sendNewsfeed(userId, currentWorkspace) {
  const socket = require('socket.io-client')('http://localhost:8080');
  socket.on('connect', () => {
    const news = {
      type: 'USER',
      author: { _id: userId },
      content: {
        method: 'DELETE',
        target: { _id: userId, name: '' },
        role: '',
      },
    };
    socket.emit('[Newsfeed] - addFromWorkspaceAndUser', news, currentWorkspace);
  });
}

module.exports = async (req, res) => {
  try {
    const { userId, currentWorkspace } = req.session;
    const user = await userSchema.findById(userId);
    await sendNewsfeed(userId, currentWorkspace);
    const organizationsOwner = await user.organizationOwner();
    await user.remove();
    return res.status(200).json({ organizations: organizationsOwner });
  } catch (e) {
    log.error(e);
    return res.status(500).send('Intern Error');
  }
};
