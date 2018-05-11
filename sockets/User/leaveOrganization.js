const organizationSchema = require('../../models/Organization');

module.exports = (io, socket) => {
  socket.on('[User] - leaveOrganization', async (newOwnerId, organizationId = socket.session.handshake.currentOrganization) => {
    const {userId} = socket.session.handshake;
    const organization = await organizationSchema.findById(organizationId);
    await organization.removeUser(userId, newOwnerId);
  });
};