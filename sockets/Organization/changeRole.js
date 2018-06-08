const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');
const _ = require('lodash');
const twig = require('twig');

module.exports = (io, socket) => {
  socket.on('[Organization] - changeRoles', async (organizationId, userAffected, newRole) => {
    try {
      const userId = socket.handshake.session.userId;
      const organization = await organizationSchema.findById(organizationId);
      const user = await userSchema.findById(userId);

      const rights = organization.userRights(userId);

      if (organization.isOwner(userId))
        await organization.changeRole(userAffected, newRole);
      else throw new Error('You have no rights');

      await organization
        .populate({ path: 'Admins', select: 'completeName' })
        .populate({ path: 'Members', select: 'completeName' })
        .execPopulate();

      twig.renderFile('./views/socket/listOrganizaitonUser.twig', {
        currentOrganization : organization,
        currentUser: { rights }
      }, function (err, html) {
        if (err) {
          console.error(err)
          return socket.emit('[Organization] - changeRoles', 'Please recharge the page');
        } else return socket.emit('[Organization] - changeRoles', null, html, organizationId);
      })
    } catch (err) {
      console.error(err);
      return socket.emit('[Organization] - changeRoles', 'Cannot change the role');
    }
  });
};
