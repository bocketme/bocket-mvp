const workspaceSchema = require('../../models/Workspace');
const twig = require('twig');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('[Workspace] - removed', async (workspaceId) => {
    try {
      const workspace = await workspaceSchema.findById(workspaceId);
      if (workspace) throw new Error('[workspace] - The Workspace exist');
      io.to(workspaceId).emit('[Workspace] - removed');
    } catch (error) {
      log.error(error)
    }
  });
}
