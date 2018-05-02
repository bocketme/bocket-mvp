const organizationSchema = require('../../models/Organization');

module.exports = (io, socket) => {

  socket.on('[Organization] - fetchAllInformations', async () => {
    const { session } = socket.handshake

    const organization = organizationSchema.findById(session.currentWorkspace);
    const 
  });
}

async function fetchOrganizationByWorkspaceID(workspaceId) {
  const organization = organizationSchema.findById(workspaceId);

}
