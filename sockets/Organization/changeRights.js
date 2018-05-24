const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');
const Twig = require('twig');

module.exports = (io, socket) => {
  socket.on('[Organization] - changeRight', async (organizationId, newRole, userId) => {
    organizationSchema.findById(organizationId).then((organisation) => {
      const currentUserId = socket.handshake.session.userId;
      if (String(organisation.Owner._id) === String(currentUserId)) {
        // USER HAS THE RIGHTS TO CHANGE ANOTHER USER'S RIGHTS
        if (String(organisation.Owner._id) !== String(userId)) {
          // User can change rights of another Organization member
          organisation.Admins = organisation.Admins.filter(elem => String(elem._id) !== String(userId));
          organisation.Members = organisation.Members.filter(elem => String(elem._id) !== String(userId));
          if (newRole === 'Admin') {
            organisation.Admins.push(userId);
            organisation.save();
            organisation.populate();
          } else if (newRole === 'Member') {
            organisation.Members.push(userId);
            organisation.save();
            organisation.populate();
          }
          Twig.renderFile('./views/socket/listOrganizationMembers.twig',
            { organization: organisation },
            (err, html) => {
              if (err)
                throw (err);
              else
                return socket.emit('[Organization] - changeRight', null, html);
          });
        } else {
          // User cannot change rights of another Organization owner
          return socket.emit('[Organization] - changeRight', 'Error: You cannot change another Owner\'s rights !');
        }
      } else {
        // USER HAS NO RIGHTS TO CHANGE ANOTHER USER'S RIGHTS
        return socket.emit('[Organization] - changeRight', 'Error: You don\'t have the rights to do this !');
      }
    });
  });
};
