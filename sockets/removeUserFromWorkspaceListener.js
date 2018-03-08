const removeUserFromWorkspaceName = 'removeUserFromWorkspace';
const WorkspaceModel = require('../models/Workspace');
const internalErrorEmiter = require('./emitter/internalErrorEmitter');

async function removeUserFromWorkspace(workspaceId, email) {
    const workspace = await WorkspaceModel.findById(workspaceId);
    await WorkspaceModel.update({ _id : workspaceId }, { $pull : { 'team.members' : { email : email }}});
    return workspace;
}

module.exports = (socket) => {
    socket.on(removeUserFromWorkspaceName, ({ userEmail }) => {
        removeUserFromWorkspace(socket.handshake.session.currentWorkspace, userEmail)
            .then((workspace) => {
                socket.emit(removeUserFromWorkspaceName, true);
            })
            .catch((err) => {
                internalErrorEmitter(socket);
            });
    });
};