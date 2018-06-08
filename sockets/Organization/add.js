const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');
const Twig = require('twig');

module.exports = (io, socket) => {
  socket.on('[Organization] - create', async (name) => {
    try {
      const {userId} = socket.handshake.session;
      const organization = new organizationSchema({
        name,
        Owner: socket.handshake.session.userId
      });

      await organization.save();

      const user = await userSchema.findById(socket.handshake.session.userId);
      await user.addOrganization(organization._id);

      await user.save();

      const userRender = await userSchema.findOne(user._id).populate('Organization._id');
      Twig.renderFile('./views/socket/listOrganization.twig',
        { userOrganizations: userRender.Organization },
        (err, html) => {
          if (err)
            throw (err);
          else
            return socket.emit('[Organization] - create', null, html);
        });
    } catch (e) {
      console.error(e);
      return socket.emit('[Organization] - create', '[Error] - Error while treating the request');
    }
  });
};
