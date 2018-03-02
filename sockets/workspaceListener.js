const workspaceListenerName = 'workspaceManager';
const WorkspaceModel = require('../models/Workspace');
const OrganizationModel = require('../models/Organization');
const log = require('../utils/log');

async function workspaceListener(workspaceId) {
  const { team } = await WorkspaceModel.findById(workspaceId);
  return team;
}

async function organizationListener(workspaceId) {
    const { organization } = await WorkspaceModel.findById(workspaceId);
    const { owner, members } = await OrganizationModel.findById(organization._id);
    return { owner, members };
}

module.exports = (socket) => {
  socket.on(workspaceListenerName, ({ type }) => {
      switch (type) {

          case 'worspace':
              workspaceListener(socket.handshake.session.currentWorkspace)
                  .then(data => {
                      console.log('data:', data);
                      socket.emit(workspaceListenerName, data);
                  })
                  .catch(log.error);
              break;

          case 'organization':
              organizationListener(socket.handshake.session.currentWorkspace)
                  .then(data => {
                      socket.emit(workspaceListenerName, data);
                  })
                  .catch(log.error);
              break;

          default:
            socket.emit(workspaceListenerName, null);
      }
  });
};
