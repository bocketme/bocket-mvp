const removeUserFromWorkspaceName = 'removeUserFromWorkspace';
const WorkspaceModel = require('../models/Workspace');
const internalErrorEmitter = require('./emitter/internalErrorEmitter');

async function removeUserFromWorkspace(workspaceId, userEmail) {
    const workspace = await WorkspaceModel.findById(workspaceId);
    await WorkspaceModel.update({ _id : workspaceId }, { $pull : { 'team.members' : { email : userEmail }}});
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