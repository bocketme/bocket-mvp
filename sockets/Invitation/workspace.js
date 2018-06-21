const invitationSchema = require('../../models/Invitation');
const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const checkData = require('./checkData');

module.exports = (io, socket) => {
  socket.on('[Invitation] - workspace', async function (workspaceId, data) {
    try {
      console.log("workspace");

      const workspace = await workspaceSchema.findById(workspaceId);

      const organization = await organizationSchema.findById(workspace.Organization);

      const people = checkData(socket, data);

      for (let i = 0; i < people.length; i++) {
        try {
          const invitation = new invitationSchema({
            workspace: { id: workspace._id, name: workspace.name, role: people[i].role },
            organization: { id: organization._id, name: organization.name, role: 4 },
            people: { completeName: people[i].completeName, email: people[i].email },
            author: socket.handshake.session.completeName,
            authorId: socket.handshake.session.userId,
          });
          await invitation.save();
        } catch (e) {
          console.error(e);
          socket.emit('[Invitation] - workspace', `Cannot Invite ${people[i].email}`);
        }
      }
      socket.emit('[Invitation] - workspace', 'Invitation send');
      return null;
    } catch (e) {
      console.error(e);
      socket.emit('[Invitation] - workspace', `Cannot Invite people`);
      return null;
    }
  })
};
