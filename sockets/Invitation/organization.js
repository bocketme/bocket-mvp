const invitationSchema = require('../../models/Invitation');
const organizationSchema = require('../../models/Organization');
const checkData = require('./checkData');

module.exports = (io, socket) => {
  socket.on('[Invitation] - orgnanization', async function (organizationId, data) {
    try {

      const organization = await organizationSchema
        .findById(organizationId);

      const people = checkData(socket, data);

      for (let i = 0; i < people.length; i++) {
        try {
          const invitation = new invitationSchema({
            organization: { id: organization._id, name: organization.name, role: people[i].role },
            people: { completeName: people[i].completeName, email: people[i].email },
            author: socket.handshake.session.completeName,
            authorId: socket.handshake.session.userId,
          });
          console.log(invitation);
          await invitation.save();  
        } catch(e) {
          socket.emit('[Invitation] - error', `Cannot Invite ${people[i].email}`);
        }
      }
      socket.emit('[Invitation] - orgnanization', 'Invitation send');
      return null;      
    } catch (e) {
      console.error(e);
      socket.emit('[Invitation] - error', `Cannot Invite people`);
      return null;
    }
  })
};

