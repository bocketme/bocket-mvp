const listenerName = 'preferences-manager-name';
const User = require('../models/User');
const Organization = require('../models/Organization');
const Workspace = require('../models/Workspace');
const twig = require('twig');
const log = require('../utils/log');

async function changeInformation(session, { type, id = null, name }) {
  const user = await User.findOne({ email: session.userMail });

  if (!user) return { error: 'Unknown user' };

  console.log(type, name);

  switch(type) {
    case 'workspace':
      const orga = await Organization.findOne({'workspaces._id': session.currentWorkspace});
      orga.name = name;
      socket.emit('workspaceModifier', orga.name);
      socket.emit('info', 'The workspace has been renamed');
      await orga.save();
      break;

    case 'organization':
      const workspace = await Workspace.findById(session.currentWorkspace);
      workspace.name = name;
      await workspace.save();
      socket.emit('organizationModifier', workspace.name);
      socket.emit('info', 'The organization has been renamed');
      break;

    default:
      throw new Error('No type');
  }
}



module.exports = (socket) => {
  socket.on(listenerName, (data) => {
    changeInformation(socket.handshake.session, data)
      .then(result => socket.emit(listenerName, result))
      .catch((err) => {
        socket.emit(listenerName, { error: 'Internal Server Error, please try again' });
        log.error('changePassword error:', err);
      });
  });
};
