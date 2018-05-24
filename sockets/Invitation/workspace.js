const Invitation = require('../../models/Invitation');
const Workspace = require('../../models/Workspace');
const checkData = require('./checkData');

module.exports = (io, socket) => {
  socket.on('[Invitation] - workspace', async function(workspaceId, data) {
    try {

      const workspace = await Workspace
        .findById(workspaceId)
        .populate('Organization', 'name').exec();

      const people = checkData(socket, data);

      for (let i = 0; i < people.length; i += 1) {
        const invitation = new Invitation({
          workspace: {id: workspaceId, name: workspace.name, role: people[i].role},
          organization: {id: workspace.Organization._id, name: workspace.Organization.name, role: 4},
          people: people[i],
          author: socket.handshake.session.completeName,
          authorId: socket.handshake.session.userId,
        });

        await invitation.save();
      }
      return null;
    } catch (e) {
      console.error(e);
      socket.emit('[Invitation] - error', `Cannot Invite people`);
      return null;
    }
  })
};
