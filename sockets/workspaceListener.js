const workspaceListenerName = 'workspaceManager';
const WorkspaceModel = require('../models/Workspace');
const OrganizationModel = require('../models/Organization');
const log = require('../utils/log');

async function workspaceListener(workspaceId, userMail) {
  const { owner, users, team } = await WorkspaceModel.findById(workspaceId).exec();
  return { isOwner: owner.email === userMail, owners: team.owners, members: [...users, ...team.members] };
}

async function organizationListener(workspaceId, userMail) {
  const { organization } = await WorkspaceModel.findById(workspaceId);
  const { owner, members } = await OrganizationModel.findById(organization._id);
  return { isOwner: owner[0].email === userMail, owners: owner, members };
}

module.exports = (socket) => {
  socket.on(workspaceListenerName, ({ type }) => {
    switch (type) {
      case 'workspace':
        workspaceListener(socket.handshake.session.currentWorkspace, socket.handshake.session.userMail)
          .then((data) => {
            console.log('data:', data);
            socket.emit(workspaceListenerName, data);
          })
          .catch(log.error);
        break;

      case 'organization':
        organizationListener(socket.handshake.session.currentWorkspace, socket.handshake.session.userMail)
          .then((data) => {
            socket.emit(workspaceListenerName, data);
          })
          .catch(log.error);
        break;

      default:
        socket.emit(workspaceListenerName, null);
    }
  });
};
