const workspaceSchema = require('../../models/Workspace');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('[Workspace] - join', async (workspaceId) => {
    try {
      const workspace = await workspaceSchema.findById(workspaceId);
      if (!workspace) throw new Error('[Workspace - join] - Cannot find the workspace');

      let isExisting = workspace.userRights(socket.handshake.session.userId);
      if (!isExisting) throw new Error('[Workspace - join] - Cannot find the user rights');

      return socket.join(workspaceId);
    } catch (e) { log.error(e); }
  })
}
