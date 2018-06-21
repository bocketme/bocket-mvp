const organizationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on("[USER] - join", async function () {
    const { currentWorkspace, currentOrganization, userId } = socket.handshake.session;
    console.log(currentWorkspace, currentOrganization)
    const organization = await organizationSchema.findById(currentOrganization);
    if (organization) {
      socket.join(currentOrganization);
    } else console.log(`Cannot find the organization`)
    const workspace = await workspaceSchema.findById(currentWorkspace);
    if (workspace) {
      socket.join(currentWorkspace);
    } else console.log(`Cannot find the workspace`)
    socket.join(userId);
  });
};
