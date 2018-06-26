const organizationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on("[USER] - join", async function () {
    const { currentWorkspace, currentOrganization, userId } = socket.handshake.session;
    log.info(currentWorkspace, currentOrganization);
    const organization = await organizationSchema.findById(currentOrganization);
    if (organization) {
      socket.join(currentOrganization);
    } else log.info(`Cannot find the organization`);
    const workspace = await workspaceSchema.findById(currentWorkspace);
    if (workspace) {
      socket.join(currentWorkspace);
    } else log.info(`Cannot find the workspace`);
    socket.join(userId);
  });
};
