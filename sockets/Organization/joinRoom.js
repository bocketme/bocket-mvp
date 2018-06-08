const organizationSchema = require('../../models/Organization');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('[Organization] - join', async (workspaceId) => {
    try {
      const organization = await organizationSchema.findById(workspaceId);
      if (!organization) throw new Error('[Workspace - join] - Cannot find the workspace');

      let isExisting = organization.userRights(socket.handshake.session.userId);
      if (!isExisting) throw new Error('[Workspace - join] - Cannot find the user rights');

      return socket.join(workspaceId);
    } catch (e) { log.error(e); }
  })
}
