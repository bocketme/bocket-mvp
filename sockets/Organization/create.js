const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');

module.exports = (io, socket) => {
  socket.on('[Organization] - create', async (name) => {
    try {
      const {userId} = socket.handshake.session;
      const organization = new organizationSchema({
        name,
        Owner: socket.handshake.session.userId
      });

      await organization.save();

      const user = await userSchema.findById(userId);
      await user.addOrganization(organization._id);

      await user.save();

      return socket.emit('[Organization] - create', null, `/organization/${organization._id}/`);
    } catch (e) {
      console.error(e);
      return socket.emit('[Organization] - create', '[Error] - Error while treating the request');
    }
  });
};
