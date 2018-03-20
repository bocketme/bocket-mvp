const workspaceListenerName = 'workspaceManager';
const WorkspaceModel = require('../models/Workspace');
const OrganizationModel = require('../models/Organization');
const log = require('../utils/log');

async function workspaceListener(workspaceId, userMail) {
  const { owner, users, team, name } = await WorkspaceModel.findById(workspaceId).catch(err => console.error(err));
  return { isOwner: owner.email === userMail, owners: team.owners, members: [...users, ...team.members], name: name };
}

async function organizationListener(workspaceId, userMail) {
  const { organization } = await WorkspaceModel.findById(workspaceId).catch(err => console.error(err));
  const { owner, members } = await OrganizationModel.findById(organization._id).catch(err => console.error(err));
  return { isOwner: owner[0].email === userMail, owners: owner, members, name: organization.name };
}

module.exports = (socket) => {
  socket.on(workspaceListenerName, ({ type }) => {
    switch (type) {
      case 'workspace':
        workspaceListener(socket.handshake.session.currentWorkspace, socket.handshake.session.userMail)
          .then((data) => {
            console.log('data : ', data);
            socket.emit(workspaceListenerName, data);
          })
          .catch(err => log.error(err));
        break;

      case 'organization':
        organizationListener(socket.handshake.session.currentWorkspace, socket.handshake.session.userMail)
          .then((data) => {
            socket.emit(workspaceListenerName, data);
          })
          .catch(err => log.error(err));
        break;

      default:
        socket.emit(workspaceListenerName, null);
    }
  });
};
