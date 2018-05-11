const workspaceSchema = require('../../models/Workspace');
const userSchema = require('../../models/User');

module.exports = (io, socket) => {
  socket.on('[User] - leaveWorkspace', async (workspaceId) => {
    const {userId} = socket.handshake.session;
    const workspace = await workspaceSchema.findById(workspaceId);
    await workspace.removeUser(userId);
    });
};