const organizationSchema = require('../../models/Organization');
const twig = require('twig');

module.exports = (io, socket) => {
  socket.on('[Organization] - remove', async function (organizaitonId, affectedUserId) {
    try {
      const currentUser = socket.handshake.session.userId
      const organization = await organizationSchema.findById(organizationId);

      const currentUserrights = organization.userRights(currentUser);
      const affectedUserRights = organization.userRights(affectedUserId);

      switch (affectedUserId) {
        case 6:
          return socket.emit("[Organization] - remove", "you do not have the rights to remove that person")
          break;
        case 5:
          if (currentUserrights === 6)
            await organization.removeUser(affectedUserId);
          else {
            return socket.emit("[Organization] - remove", "you do not have the rights to remove that person")
          }
          break;
        case 4:
          if (currentUserrights > 4)
            await organization.removeUser(affectedUserId);
          else {
            return socket.emit("[Organization] - remove", "you do not have the rights to remove that person")
          }
          break;
        default:
          throw new Error('Cannot find the user inside the organization');
          break;
      }

      twig.renderFile('./views/socket/listOrganizaitonUser.twig', {
        currentOrganization: organization,
        currentUser: { currentUserrights }
      }, function (err, html) {
        if (err) {
          console.error(err)
          return socket.emit('[Organization] - remove', 'Please recharge the page');
        } else return socket.emit('[Organization] - remove', null, html, workspaceId);
      })
    } catch (error) {
      console.error(error);
      socket.emit('[Organization] - remove', 'Intern Error - cannot remove this person from the organization')
    }
  })
}
