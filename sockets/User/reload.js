const organizationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on("[USER] - reload Workspace", async function (workspaceId) {
    try {
      const { userId } = socket.handshake.session
      const workspace = await workspaceSchema.findById(workspaceId)
      if (!workspace) throw new Error('[USER] - Cannot find the workspace')
      if (workspace.hasRights(userId)) io.to(workspaceId).emit('reload');
    } catch (error) {
      log.error(error)
    }

  });
  socket.on("[USER] - reload Organization", async function (organizationId) {
    try {
      const { userId } = socket.handshake.session
      const organization = await organizationSchema.findById(organizationId)
      if (!organization) throw new Error('[USER] - Cannot find the organization')
      if (organization.userRights(userId)) io.to(organizationId).emit('reload');
    } catch (error) {
      log.error(error)
    }
  });
}
