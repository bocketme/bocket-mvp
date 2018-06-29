const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const log = require('../../utils/log');

/**
 *
 * @param io
 * @param socket
 */
module.exports = (io, socket) => {
  socket.on('[User] - removed Workspace', async (workspaceId, userId) => {
    try {
      const workspace = await workspaceSchema.findById(workspaceId);
      const workspaceRights = workspace.userRights(userId);
      if (workspaceRights) throw new Error('[User] - The user already existed');
      io.to(userId).emit('[User] - removed Workspace');
    } catch (error) {
      log.error(error);
    }
  });
  socket.on('[User] - removed Organization', async (organizationId, userId) => {
    try {
      const organizaiton = await organizationSchema.findById(organizationId)
      const organizationRights = organizaiton.hasRights(userId);
      if (organizationRights) throw new Error('[User] - The user already existed');
      io.to(userId).emit('[User] - removed Organization');
    } catch (error) {
      log.error(error);
    }
  });
}
