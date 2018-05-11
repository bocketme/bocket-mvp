const organizationSchema = require('../../models/Organization');

module.exports = (io, socket) => {
  socket.on('[Organization] - delete', async (organizationId) => {
    try {
      const organizaiton = organizationSchema.findById(organizationId);
      const {userId} = socket.handshake.session;
      const owner = organizaiton.get('Owner');
      const ownerId = String(owner);
      if(ownerId=== userId)
        await organizaiton.remove();
      else
        throw new error('You have no right');
    }catch (e) {
      console.error(e);
      socket.emit('[Organization] - delete', 'You cannot delete the organization');
    }
  });
};