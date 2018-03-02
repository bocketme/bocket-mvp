const workspaceListenerName = 'workspaceManager';
const WorkspaceModel = require('../models/Workspace');

async function workspaceListener(workspaceId) {
  const { team } = await WorkspaceModel.findById(workspaceId);
  return { owner: false, members: team.members };
}

module.exports = (socket) => {
  socket.on(workspaceListenerName, ({ type }) => {
    if (type === 'workspace') {
      workspaceListener(socket.handshake.session.currentWorkspace)
        .then((data) => {
          console.log('data:', data);
          socket.emit(workspaceListenerName, data);
        })
        .catch(console.log);
    }
  });
};
