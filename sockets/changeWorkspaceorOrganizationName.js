const listenerName = 'changeWorkspaceOrOrganizationName';
const User = require('../models/User');
const Organization = require('../modals/Organization');
const Workspace = require('../modals/Workspace');
const twig = require('twig');
const log = require('../utils/log');

async function changeInformation(session, { type, id = null, newName }) {
  const user = await User.findOne({ email: session.userMail });

  if (!user) return { error: 'Unknown user' };

  let dataToCHange;
  switch(type) {
    case 'workspace':
      const dataToCHange = await Organization.findOne({'workspaces._id': session.currentWorkspace});
      dataToCHange.name = newName;
      socket.emit('workspaceModifier', dataToCHange.name);
      socket.emit('info', 'The workspace has been renamed');
      await dataToCHange.save();
      break;

    case 'organization':
      const dataToCHange = await Workspace.findById(session.currentWorkspace);
      dataToCHange.name = newName;
      await dataToCHange.save();
      socket.emit('organizationModifier', dataToCHange.name);
      socket.emit('info', 'The organization has been renamed');
      break;
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
