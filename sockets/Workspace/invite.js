const Invitation = require('../../models/Invitation');
const Workspace = require('../../models/Workspace');
const log = require('../../utils/log');
const Organization = require('../../models/Organization');

module.exports = (io, socket) => {
  socket.on("[Workpsace] - Invite People", async (workspaceId, author, data) => {
    try {
      if (!data.length) return null;

      const workspace = Workspace
        .findById(workspaceId)
        .populate('Organization')
        .exec();

      const people = await checkData(userId, data);
      if (people.length && people.length > 0) {
        for (let i = 0; i < people.length; i++) {

          const invitation = await Invitation.create({
            workspace: { id: workspaceId, name: workspace.name },
            organization: { id: workspace.Organization._id, name: workspace.Organization.name },
            people: people[i],
            author,
            authorId: socket.handshake.session.userId
          });

          await invitation.save();
        }
      }
    } catch (e) {
      log.error(e);
      socket.emit("[Workpsace] - Invite People", 'Cannot save the workspace');
    }
  });
};

const checkData = async (workspaceId, userId) => {
  const organization = Organization.findById(workspaceId);
  organization.findUserRights(userId);

};
