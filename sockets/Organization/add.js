const organizationSchema = require('../../models/Organization');

module.exports = () => {
  socket.on('[Organization] - create', async (name) => {
    const organization = new organizationSchema({
      name,
      Owner: socket.handshake.session.userId
    });

    await organization.save();
    socket.emit('[Organization] - create');
  });
};